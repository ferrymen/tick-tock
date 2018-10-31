import {
  InjectToken,
  MapSet,
  Type,
  ObjectMap,
  IContainer,
  Providers,
} from '@ferrymen/fm-ioc-core';
import { AdviceMetadata } from './metadatas';
import { Advices } from './advices';

/**
 * Aop IAdvisor interface token.
 * it is a token id, you can register yourself IAdvisor for this.
 */
export const AdvisorToken = new InjectToken<IAdvisor>('DI_IAdvisor');

/**
 * aspect and advices manager.
 *
 */
export interface IAdvisor {
  /**
   * aspects
   *
   */
  aspects: MapSet<Type<any>, ObjectMap<AdviceMetadata[]>>;
  /**
   * advices
   *
   */
  advices: MapSet<string, Advices>;

  /**
   * has register advices or not.
   *
   */
  hasRegisterAdvices(targetType: Type<any>): boolean;
  /**
   * set advices.
   */
  setAdvices(key: string, advices: Advices);
  /**
   * get advices.
   *
   */
  getAdvices(key: string): Advices;

  /**
   * add aspect.
   *
   */
  add(aspect: Type<any>, raiseContainer: IContainer);

  /**
   * get aspect registered container.
   *
   */
  getContainer(aspect: Type<any>, defaultContainer?: IContainer): IContainer;

  /**
   * resolve aspect.
   *
   */
  resolve<T>(aspect: Type<T>, ...providers: Providers[]): T;
}
