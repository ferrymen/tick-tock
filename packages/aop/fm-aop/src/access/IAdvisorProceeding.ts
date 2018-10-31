import { InjectToken, Express } from '@ferrymen/fm-ioc-core';
import { Joinpoint } from '../joinpoints';

/**
 * Aop IAdvisorProceeding interface token.
 * it is a token id, you can register yourself IAdvisorProceeding for this.
 */
export const AdvisorProceedingToken = new InjectToken<IAdvisorProceeding>(
  'DI_IAdvisorProceeding'
);

/**
 * advisor proceeding.
 *
 */
export interface IAdvisorProceeding {
  /**
   * process.
   *
   */
  proceeding(joinPoint: Joinpoint, ...actions: Express<Joinpoint, any>[]);
}
