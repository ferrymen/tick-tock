import { Type, ClassMetadata } from '@ferrymen/fm-ioc-core';

export interface AspectMetadata extends ClassMetadata {
  /**
   * set pointcut in the type only.
   *
   */
  within?: Type<any> | Type<any>[];

  /**
   * set pointcut in the class with the annotation decorator only.
   *
   */
  annotation?: string | Function;
}
