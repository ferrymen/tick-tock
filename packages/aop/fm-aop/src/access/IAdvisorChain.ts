import { InjectToken, Express, IRecognizer } from '@ferrymen/fm-ioc-core';
import { Joinpoint } from '../joinpoints';

/**
 * Aop IAdvisorChain interface token.
 * it is a token id, you can register yourself IAdvisorChain for this.
 */
export const AdvisorChainToken = new InjectToken<IAdvisorChain>(
  'DI_IAdvisorChain'
);

/**
 * advisor chain.
 *
 */
export interface IAdvisorChain {
  /**
   * register next step of chain.
   *
   */
  next(action: Express<Joinpoint, any>);
  /**
   * get Recognizer of the chain, to recognize the vaule is special alias for registor to container.
   *
   */
  getRecognizer(): IRecognizer;
  /**
   * run chain process.
   *
   */
  process(): void;
}
