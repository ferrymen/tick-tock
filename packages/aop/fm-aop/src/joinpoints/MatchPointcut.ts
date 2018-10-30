import { AdviceMetadata } from '../metadatas';
import { IPointcut } from './IPointcut';

export interface MatchPointcut extends IPointcut {
  /**
   * advice for pointcut.
   *
   */
  advice: AdviceMetadata;
}
