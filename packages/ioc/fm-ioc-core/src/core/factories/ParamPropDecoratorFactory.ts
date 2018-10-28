import { ParamPropMetadata } from '../metadatas';
import {
  createDecorator,
  MetadataAdapter,
  MetadataExtends,
} from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { isToken, isParamPropMetadata } from '../../utils';
import { ArgsIterator } from './ArgsIterator';
import { Token } from '../../types';

export type PropParamDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex?: number
) => void;
/**
 * Parameter and Property decorator.
 *
 */
export interface IParamPropDecorator<T extends ParamPropMetadata> {
  /**
   * define parameter or property decorator with param.
   *
   */
  (provider: Token<any>): PropParamDecorator;
  /**
   * define parameter or property decorator with metadata map.
   */
  (metadata?: T): PropParamDecorator;
  (target: object, propertyKey: string | symbol, parameterIndex?: number): void;
}

/**
 * create parameter or property decorator
 *
 */
export function createParamPropDecorator<T extends ParamPropMetadata>(
  name: string,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IParamPropDecorator<T> {
  let paramPropAdapter = (args: ArgsIterator) => {
    if (adapter) {
      adapter(args);
    }
    args.next<T>({
      isMetadata: arg => isParamPropMetadata(arg),
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
  let decorator = createDecorator<T>(name, paramPropAdapter, metadataExtends);
  decorator.decoratorType = DecoratorType.Property | DecoratorType.Parameter;
  return decorator;
}
