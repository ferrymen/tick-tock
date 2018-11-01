import { IAnnotationMetadata, Token } from '@ferrymen/fm-ioc-core';
import { IAnnotationBuilder } from './IAnnotationBuilder';

/**
 * type build config.
 *
 */
export interface AnnotationConfigure<T> extends IAnnotationMetadata<T> {
  /**
   * autorun.
   */
  autorun?: string;

  /**
   * annotation builder.
   *
   */
  annotationBuilder?: Token<IAnnotationBuilder<T>> | IAnnotationBuilder<T>;
}
