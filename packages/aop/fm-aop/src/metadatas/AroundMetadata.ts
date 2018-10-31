import { AfterReturningMetadata } from './AfterReturningMetadata';
import { AfterThrowingMetadata } from './AfterThrowingMetadata';

export interface AroundMetadata
  extends AfterReturningMetadata,
    AfterThrowingMetadata {
  /**
   * set name provider of annotation metadata for advices.
   *
   */
  args?: string;
  /**
   * set name provider of pointcut returing data for advices.
   *
   */
  returning?: string;
}
