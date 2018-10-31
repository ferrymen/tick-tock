import { AdviceMetadata } from './AdviceMetadata';

export interface AfterThrowingMetadata extends AdviceMetadata {
  /**
   * set name provider of pointcut throwing error for advices.
   *
   */
  throwing?: string;
}
