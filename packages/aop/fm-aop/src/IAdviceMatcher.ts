import { InjectToken, Type, ObjectMap } from '@ferrymen/fm-ioc-core';
import { AdviceMetadata } from './metadatas';
import { MatchPointcut } from './joinpoints';

/**
 * Aop advice matcher interface token.
 * it is a token id, you can register yourself IActionBuilder for this.
 */
export const AdviceMatcherToken = new InjectToken<IAdviceMatcher>(
  'DI_IAdviceMatcher'
);

/**
 * advice match interface, use to match advice when a registered create instance.
 *
 */
export interface IAdviceMatcher {
  /**
   * match pointcuts of type.
   *
   */
  match(
    aspectType: Type<any>,
    type: Type<any>,
    adviceMetas?: ObjectMap<AdviceMetadata[]>,
    instance?: any
  ): MatchPointcut[];
}
