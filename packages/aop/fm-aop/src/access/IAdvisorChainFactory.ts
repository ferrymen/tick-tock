import { InjectToken } from '@ferrymen/fm-ioc-core';
import { Advicer } from '../advices';
import { Joinpoint, JoinpointState } from '../joinpoints';

/**
 * Aop IAdvisorChainFactory interface token.
 * it is a token id, you can register yourself IAdvisorChainFactory for this.
 */
export const AdvisorChainFactoryToken = new InjectToken<IAdvisorChainFactory>(
  'DI_IAdvisorChainFactory'
);

/**
 * advice advisor chain factory for proxy method invoke.
 *
 */
export interface IAdvisorChainFactory {
  /**
   * get advices config.
   *
   */
  getAdvicers(adviceType: string): Advicer[];

  /**
   * invoke advives via state.
   *
   */
  invoaction(
    joinPoint: Joinpoint,
    state: JoinpointState,
    valueOrthrowing?: any
  ): void;

  /**
   * invoke before advices.
   *
   */
  before(joinPoint: Joinpoint): void;

  /**
   * invoke pointcut advives.
   *
   */
  pointcut(joinPoint: Joinpoint): void;

  /**
   * invoke after advives.
   *
   */
  after(joinPoint: Joinpoint): void;

  /**
   * invoke throwing advives.
   *
   */
  afterThrowing(joinPoint: Joinpoint): void;

  /**
   * invoke returning advives.
   *
   */
  afterReturning(joinPoint: Joinpoint): void;
}
