import {
  ITypeDecorator,
  Token,
  MetadataAdapter,
  MetadataExtends,
  createClassDecorator,
  isClass,
} from '@ferrymen/fm-ioc-core';
import { ModuleConfig, IModuleBuilder } from '../modules';
import { IAnnotationBuilder } from '../annotations';

/**
 * DI module metadata.
 *
 */
export interface DIModuleMetadata extends ModuleConfig<any> {
  /**
   * custom decorator type.
   *
   */
  decorType?: string;
}

/**
 * DIModule decorator, use to define class as DI Module.
 *
 */
export interface IDIModuleDecorator<T extends DIModuleMetadata>
  extends ITypeDecorator<T> {
  /**
   * DIModule decorator, use to define class as DI Module.
   *
   * @DIModule
   *
   */
  (metadata: T): ClassDecorator;
}

/**
 * create bootstrap decorator.
 *
 */
export function createDIModuleDecorator<T extends DIModuleMetadata>(
  name: string,
  builder?: Token<IModuleBuilder<any>> | IModuleBuilder<any>,
  annotationBuilder?: Token<IAnnotationBuilder<any>> | IAnnotationBuilder<any>,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IDIModuleDecorator<T> {
  return createClassDecorator<DIModuleMetadata>(
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

      if (!metadata.name && isClass(metadata.token)) {
        let isuglify = /^[a-z]$/.test(metadata.token.name);
        if (isuglify && metadata.token.classAnnations) {
          metadata.name = metadata.token.classAnnations.name;
        } else {
          metadata.name = metadata.token.name;
        }
      }

      metadata.decorType = name;
      if (builder && !metadata.builder) {
        metadata.builder = builder;
      }
      if (annotationBuilder && !metadata.annotationBuilder) {
        metadata.annotationBuilder = annotationBuilder;
      }
      return metadata;
    }
  ) as IDIModuleDecorator<T>;
}

/**
 * DIModule Decorator, definde class as DI module.
 *
 * @DIModule
 */
export const DIModule: IDIModuleDecorator<
  DIModuleMetadata
> = createDIModuleDecorator<DIModuleMetadata>('DIModule');
