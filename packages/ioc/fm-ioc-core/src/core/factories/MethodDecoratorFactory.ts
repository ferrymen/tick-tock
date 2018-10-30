import 'reflect-metadata';
import { MethodMetadata } from '../metadatas';
import { Providers } from '../../types';
import {
  createDecorator,
  MetadataAdapter,
  MetadataExtends,
} from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { ArgsIterator } from './ArgsIterator';
import { isArray } from '../../utils';

/**
 * Method decorator.
 *
 */
export interface IMethodDecorator<T extends MethodMetadata> {
  /**
   * create method decorator with providers.
   *
   */
  (providers?: Providers[]): MethodDecorator;
  /**
   * create method decorator with metadata map.
   *
   */
  (metadata?: T): MethodDecorator;
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): void;
}

/**
 * create method decorator.
 */
export function createMethodDecorator<T extends MethodMetadata>(
  name: string,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IMethodDecorator<T> {
  let methodAdapter = (args: ArgsIterator) => {
    if (adapter) {
      adapter(args);
    }

    args.next<T>({
      match: arg => isArray(arg),
      setMetadata: (metadata, arg) => {
        metadata.providers = arg;
      },
    });
  };

  let decorator = createDecorator<T>(name, methodAdapter, metadataExtends);
  decorator.decoratorType = DecoratorType.Method;
  return decorator;
}
