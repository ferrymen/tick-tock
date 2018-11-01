import { AnnotationConfigure, IAnnotationBuilder } from '../annotations';
import {
  Token,
  MetadataAdapter,
  MetadataExtends,
  createClassDecorator,
  ITypeDecorator,
} from '@ferrymen/fm-ioc-core';

export interface AnnotationMetadata extends AnnotationConfigure<any> {}

/**
 * Annotation decorator, use to define class build way via config.
 *
 */
export interface IAnnotationDecorator<T extends AnnotationMetadata>
  extends ITypeDecorator<T> {
  /**
   * Annotation decorator, use to define class as DI Module.
   *
   * @Build
   */
  (metadata: T): ClassDecorator;
}

/**
 * create type builder decorator
 *
 */
export function createAnnotationDecorator<T extends AnnotationMetadata>(
  name: string,
  builder?: Token<IAnnotationBuilder<any>> | IAnnotationBuilder<any>,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IAnnotationDecorator<T> {
  return createClassDecorator<AnnotationMetadata>(
    name,
    args => {
      if (adapter) {
        adapter(args);
      }
    },
    metadata => {
      if (metadataExtends) {
        metadata = metadataExtends(metadata as T);
      }

      if (builder && !metadata.annotationBuilder) {
        metadata.annotationBuilder = builder;
      }
      return metadata;
    }
  ) as IAnnotationDecorator<T>;
}

/**
 * Annotation decorator, use to define class build way via config.
 *
 * @Annotation
 */
export const Annotation: IAnnotationDecorator<
  AnnotationMetadata
> = createAnnotationDecorator<AnnotationMetadata>('Annotation');
