import { Type } from '../../types';
import { TypeMetadata } from '../metadatas';
import {
  createDecorator,
  MetadataAdapter,
  MetadataExtends,
} from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';

export type ClassMethodDecorator = (
  target: Object | Type<any>,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<any>
) => void;

/**
 * class method decorator
 *
 */
export interface IClassMethodDecorator<T extends TypeMetadata> {
  /**
   * create decorator with metadata map. for class or method decorator.
   *
   */
  (metadata?: T): ClassMethodDecorator;

  (target: Type<any>): void;
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): void;
}

/**
 * create decorator for class and method.
 *
 */
export function createClassMethodDecorator<T extends TypeMetadata>(
  name: string,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IClassMethodDecorator<T> {
  let decorator = createDecorator<T>(name, adapter, metadataExtends);
  decorator.decoratorType = DecoratorType.Class | DecoratorType.Method;
  return decorator;
}
