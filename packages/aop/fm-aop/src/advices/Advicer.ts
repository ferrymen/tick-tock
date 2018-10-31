import { Type } from '@ferrymen/fm-ioc-core';
import { MatchPointcut } from '../joinpoints';

/**
 * AdviceInvokerData
 *
 */
export interface Advicer extends MatchPointcut {
  /**
   * aspect type.
   *
   */
  aspectType: Type<any>;
}
