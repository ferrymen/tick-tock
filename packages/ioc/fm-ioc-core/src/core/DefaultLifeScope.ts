import { LifeScope, DecorSummary } from '../LifeScope';
import { ActionData } from './ActionData';
import { ActionComponent, LifeState, CoreActions } from './actions';
import { IContainer } from '../IContainer';
import { Lang, isArray, isClass, isAbstractDecoratorClass } from '../utils';
import { IParameter } from '../IParameter';
import {
  hasOwnClassMetadata,
  getOwnTypeMetadata,
  DecoratorType,
  getOwnParamerterNames,
  getOwnMethodMetadata,
} from './factories';
import { Type, Express, Token, IocState, ObjectMap } from '../types';
import { ClassMetadata, MethodMetadata } from './metadatas';
import { Singleton } from './decorators';
import { ActionFactory } from './ActionFactory';

export class DefaultLifeScope implements LifeScope {
  decorators: DecorSummary[];
  action: ActionComponent;

  constructor(private container: IContainer) {
    this.decorators = [];
    this.buildAction();
  }

  registerDecorator(decorator: Function, ...actions: string[]): this {
    let type = this.getDecoratorType(decorator);
    return this.registerCustomDecorator(decorator, type, ...actions);
  }
  /**
   * get constructor parameters metadata.
   *
   */
  getConstructorParameters<T>(type: Type<T>): IParameter[] {
    return this.getParameters(type);
  }
  isSingletonType<T>(type: Type<T>): boolean {
    if (hasOwnClassMetadata(Singleton, type)) {
      return true;
    }

    return this.getClassDecorators().some(surm => {
      let metadatas =
        (getOwnTypeMetadata(surm.name, type) as ClassMetadata[]) || [];
      if (isArray(metadatas)) {
        return metadatas.some(m => m.singleton === true);
      }
      return false;
    });
  }
  getClassDecorators(match?: Express<DecorSummary, boolean>): DecorSummary[] {
    return this.getTypeDecorators(
      this.toActionName(DecoratorType.Class),
      match
    );
  }
  getDecoratorType(decirator: any): DecoratorType {
    return decirator.decoratorType || DecoratorType.All;
  }
  registerCustomDecorator(
    decorator: Function,
    type: DecoratorType,
    ...actions: string[]
  ): this {
    let types = this.toActionName(type);
    let name = decorator.toString();
    if (!this.decorators.some(d => d.name === name)) {
      this.decorators.push({
        name: name,
        types: types,
        actions: actions,
      });
    }
    return this;
  }

  protected getParameters<T>(
    type: Type<T>,
    instance?: T,
    propertyKey?: string
  ): IParameter[] {
    propertyKey = propertyKey || 'constructor';
    let data = {
      target: instance,
      targetType: type,
      propertyKey: propertyKey,
    } as ActionData<Token<any>[]>;
    this.execute(data, LifeState.onInit, CoreActions.bindParameterType);

    let paramNames = this.getParamerterNames(type, propertyKey);

    if (data.execResult.length) {
      return data.execResult.map((typ, idx) => {
        return {
          type: typ,
          name: paramNames[idx],
        };
      });
    } else {
      return paramNames.map(name => {
        return {
          name: name,
          type: undefined,
        };
      });
    }
  }

  protected getTypeDecorators(
    decType: string,
    match?: Express<DecorSummary, boolean>
  ): DecorSummary[] {
    return this.filerDecorators(value => {
      let flag = (value.types || '').indexOf(decType) >= 0;
      if (flag && match) {
        flag = match(value);
      }
      return flag;
    });
  }

  toActionName(type: DecoratorType): string {
    let types = [];
    if (type & DecoratorType.Class) {
      types.push('ClassDecorator');
    }
    if (type & DecoratorType.Method) {
      types.push('MethodDecorator');
    }
    if (type & DecoratorType.Property) {
      types.push('PropertyDecorator');
    }
    if (type & DecoratorType.Parameter) {
      types.push('ParameterDecorator');
    }

    return types.join(',');
  }

  protected buildAction() {
    let factory = new ActionFactory();

    let action = factory.create('');
    action
      .add(
        factory
          .create(IocState.design)
          .add(factory.create(CoreActions.bindProvider))
          .add(factory.create(CoreActions.autorun))
      )
      .add(
        factory
          .create(IocState.runtime)
          .add(factory.create(LifeState.beforeCreateArgs))
          .add(factory.create(LifeState.beforeConstructor))
          .add(factory.create(LifeState.afterConstructor))
          .add(
            factory
              .create(LifeState.onInit)
              .add(factory.create(CoreActions.componentBeforeInit))
              .add(factory.create(this.toActionName(DecoratorType.Class)))
              .add(factory.create(this.toActionName(DecoratorType.Method)))
              .add(
                factory
                  .create(this.toActionName(DecoratorType.Property))
                  .add(factory.create(CoreActions.bindPropertyType))
                  .add(factory.create(CoreActions.injectProperty))
              )
              .add(
                factory
                  .create(this.toActionName(DecoratorType.Parameter))
                  .add(factory.create(CoreActions.bindParameterType))
                  .add(factory.create(CoreActions.bindParameterProviders))
              )
              .add(factory.create(CoreActions.componentInit))
          )
          .add(
            factory
              .create(LifeState.AfterInit)
              .add(factory.create(CoreActions.singletion))
              .add(factory.create(CoreActions.componentAfterInit))
              .add(factory.create(CoreActions.methodAutorun))
          )
      )
      .add(factory.create(CoreActions.cache));

    this.action = action;
  }

  /**
   * get paramerter names.
   *
   */
  getParamerterNames<T>(type: Type<T>, propertyKey: string): string[] {
    let metadata = getOwnParamerterNames(type);
    let paramNames = [];
    if (metadata && metadata.hasOwnProperty(propertyKey)) {
      paramNames = metadata[propertyKey];
    }
    if (!isArray(paramNames)) {
      paramNames = [];
    }
    return paramNames;
  }

  filerDecorators(express?: Express<DecorSummary, boolean>): DecorSummary[] {
    return this.decorators.filter(express);
  }

  execute<T>(data: ActionData<T>, ...names: string[]) {
    names = names.filter(n => !!n);
    let act: ActionComponent = this.action;
    names.forEach(name => {
      act = act.find(itm => itm.name === name);
    });
    if (act) {
      act.execute(this.container, data);
    }
  }

  routeExecute<T>(data: ActionData<T>, ...names: string[]) {
    this.execute(data, ...names);
    let container = this.container.parent;
    while (container) {
      container.getLifeScope().execute(Lang.assign({}, data), ...names);
      container = container.parent;
    }
  }

  addAction(action: ActionComponent, ...nodepaths: string[]): this {
    let parent = this.action;
    nodepaths.forEach(pathname => {
      parent = parent.find(act => act.name === pathname);
    });
    if (parent) {
      parent.add(action);
    }

    return this;
  }

  /**
   * is vaildate dependence type or not. dependence type must with class decorator.
   *
   */
  isVaildDependence<T>(target: Type<T>): boolean {
    if (!target) {
      return false;
    }
    if (!isClass(target)) {
      return false;
    }

    if (isAbstractDecoratorClass(target)) {
      return false;
    }
    return this.getClassDecorators().some(act =>
      hasOwnClassMetadata(act.name, target)
    );
  }
  getParameterDecorators(
    match?: Express<DecorSummary, boolean>
  ): DecorSummary[] {
    return this.getTypeDecorators(
      this.toActionName(DecoratorType.Parameter),
      match
    );
  }
  getPropertyDecorators(
    match?: Express<DecorSummary, boolean>
  ): DecorSummary[] {
    return this.getTypeDecorators(
      this.toActionName(DecoratorType.Property),
      match
    );
  }
  getMethodDecorators(match?: Express<DecorSummary, boolean>): DecorSummary[] {
    return this.getTypeDecorators(
      this.toActionName(DecoratorType.Method),
      match
    );
  }

  /**
   * get method params metadata.
   *
   */
  getMethodParameters<T>(
    type: Type<T>,
    instance: T,
    propertyKey: string
  ): IParameter[] {
    return this.getParameters(type, instance, propertyKey);
  }

  getMethodMetadatas<T>(type: Type<T>, propertyKey: string): MethodMetadata[] {
    let metadatas = [];
    this.getMethodDecorators().forEach(dec => {
      let metas: ObjectMap<MethodMetadata[]> = getOwnMethodMetadata<
        MethodMetadata
      >(dec.name, type);
      if (metas.hasOwnProperty(propertyKey)) {
        metadatas = metadatas.concat(metas[propertyKey] || []);
      }
    });
    return metadatas;
  }
}
