import { ActionData } from './core/ActionData';
import { ActionComponent } from './core/actions';
import { InjectToken } from './InjectToken';
import { Type, Express } from './types';
import { IParameter } from './IParameter';
import { MethodMetadata } from './core/metadatas';

/**
 * life scope interface symbol.
 * it is a symbol id, you can register yourself MethodAccessor for this.
 */
export const LifeScopeToken = new InjectToken<LifeScope>('DI_LifeScope');

/**
 * life scope of decorator
 */
export interface LifeScope {
  /**
   * execute the action work
   *
   * @param data
   * @param names
   */
  execute<T>(data: ActionData<T>, ...names: string[]): void;

  /**
   * execute the action work route with parent container.
   */
  routeExecute<T>(data: ActionData<T>, ...names: string[]): void;

  /**
   * register action.
   */
  addAction(action: ActionComponent, ...nodepaths: string[]): this;

  /**
   * register decorator.
   *
   */
  registerDecorator(decorator: Function, ...actions: string[]): this;

  /**
   * get constructor parameters metadata.
   *
   */
  getConstructorParameters<T>(type: Type<T>): IParameter[];

  /**
   * is singleton or not.
   *
   */
  isSingletonType<T>(type: Type<T>): boolean;

  /**
   * get class decorators
   *
   */
  getClassDecorators(match?: Express<DecorSummary, boolean>): DecorSummary[];

  /**
   * is vaildate dependence type or not. dependence type must with class decorator.
   *
   */
  isVaildDependence<T>(target: any): boolean;

  /**
   * get parameter decorators
   *
   */
  getParameterDecorators(
    match?: Express<DecorSummary, boolean>
  ): DecorSummary[];

  /**
   * get property decorators
   *
   */
  getPropertyDecorators(match?: Express<DecorSummary, boolean>): DecorSummary[];

  /**
   * get method decorators
   *
   */
  getMethodDecorators(match?: Express<DecorSummary, boolean>): DecorSummary[];

  /**
   * get method params metadata.
   *
   */
  getMethodParameters<T>(
    type: Type<T>,
    instance: T,
    propertyKey: string
  ): IParameter[];

  /**
   * get method metadatas
   *
   */
  getMethodMetadatas<T>(
    type: Type<T>,
    propertyKey: string | symbol
  ): MethodMetadata[];
}

/**
 * Decorator summary.
 *
 */
export interface DecorSummary {
  /**
   * decorator name.
   *
   */
  name: string;
  /**
   * decorator types.
   *
   */
  types: string;
  /**
   * decorator registed actions.
   *
   */
  actions: string[];
}
