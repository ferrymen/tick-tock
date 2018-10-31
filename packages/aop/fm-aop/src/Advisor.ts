import {
  Singleton,
  MapSet,
  Type,
  ObjectMap,
  IContainer,
  getClassName,
  getOwnMethodMetadata,
  Providers,
  Lang,
} from '@ferrymen/fm-ioc-core';

import { Advices } from './advices';
import { NonePointcut, Advice } from './decorators';
import { IAdvisor, AdvisorToken } from './IAdvisor';
import { AdviceMetadata } from './metadatas';

/**
 * for global aop advisor.
 *
 */
@NonePointcut()
@Singleton(AdvisorToken)
export class Advisor implements IAdvisor {
  /**
   * aspects.
   *
   */
  aspects: MapSet<Type<any>, ObjectMap<AdviceMetadata[]>>;

  protected aspectIocs: MapSet<Type<any>, IContainer>;
  /**
   * method advices.
   *
   */
  advices: MapSet<string, Advices>;

  constructor() {
    this.aspects = new MapSet();
    this.aspectIocs = new MapSet();
    this.advices = new MapSet();
  }

  setAdvices(key: string, advices: Advices) {
    if (!this.advices.has(key)) {
      this.advices.set(key, advices);
    }
  }

  getAdvices(key: string) {
    if (!this.advices.has(key)) {
      return null;
    }
    return this.advices.get(key);
  }

  hasRegisterAdvices(targetType: Type<any>): boolean {
    let methods = Lang.keys(
      Object.getOwnPropertyDescriptors(targetType.prototype)
    );
    let className = getClassName(targetType);
    return methods.some(m => this.advices.has(`${className}.${m}`));
  }

  add(aspect: Type<any>, raiseContainer: IContainer) {
    if (!this.aspects.has(aspect)) {
      let metas = getOwnMethodMetadata<AdviceMetadata>(Advice, aspect);
      this.aspects.set(aspect, metas);
      this.aspectIocs.set(aspect, raiseContainer);
    }
  }

  getContainer(aspect: Type<any>, defaultContainer?: IContainer): IContainer {
    if (this.aspectIocs.has(aspect)) {
      return this.aspectIocs.get(aspect) || defaultContainer;
    }
    return defaultContainer;
  }

  /**
   * resolve aspect.
   *
   */
  resolve<T>(aspect: Type<T>, ...providers: Providers[]): T {
    if (this.aspectIocs.has(aspect)) {
      return this.aspectIocs.get(aspect).resolve(aspect, ...providers);
    }
    return null;
  }
}
