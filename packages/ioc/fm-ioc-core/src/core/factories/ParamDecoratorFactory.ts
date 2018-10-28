// import 'reflect-metadata';
import { ParameterMetadata } from '../metadatas';
import {
  createDecorator,
  MetadataAdapter,
  MetadataExtends,
} from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { isToken, isParamMetadata } from '../../utils';
import { ArgsIterator } from './ArgsIterator';
import { Token } from '../../types';

/**
 * Parameter decorator.
 *
 */
export interface IParameterDecorator<T extends ParameterMetadata> {
  /**
   * define parameter decorator with param.
   *
   */
  (provider: Token<T>): ParameterDecorator;
  /**
   * define parameter decorator with metadata map.
   */
  (metadata?: T): ParameterDecorator;
  (target: object, propertyKey: string | symbol, parameterIndex: number): void;
}

/**
 * create parameter decorator.
 *
 */
export function createParamDecorator<T extends ParameterMetadata>(
  name: string,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IParameterDecorator<T> {
  let paramAdapter = (args: ArgsIterator) => {
    if (adapter) {
      adapter(args);
    }
    args.next<T>({
      isMetadata: arg => isParamMetadata(arg),
      match: arg => isToken(arg),
      setMetadata: (metadata, arg) => {
        metadata.provider = arg;
      },
    });
    // args.next<T>({
    //     match: (arg) => isString(arg),
    //     setMetadata: (metadata, arg) => {
    //         metadata.alias = arg;
    //     }
    // });
  };
  let decorator = createDecorator<T>(name, paramAdapter, metadataExtends);
  decorator.decoratorType = DecoratorType.Parameter;
  return decorator;
}
