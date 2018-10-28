import { Type } from '../../types';
import { Registration } from '../../Registration';
import { ClassMetadata } from '../metadatas';
import { isSymbol, isString, isObject, isBoolean, isNumber } from '../../utils';
import {
  MetadataAdapter,
  MetadataExtends,
  createDecorator,
} from './DecoratorFactory';
import { ArgsIterator } from './ArgsIterator';
import { DecoratorType } from './DecoratorType';

/**
 * Type decorator.
 *
 */
export interface ITypeDecorator<T extends ClassMetadata> {
  /**
   * define class decorator setting with metadata map.
   *
   */
  (metadata?: T): ClassDecorator;
  /**
   * not allow abstract to decorator with out metadata.
   */
  (target: Type<any>): void;
}

/**
 * class decorator.
 *
 */
export interface IClassDecorator<T extends ClassMetadata>
  extends ITypeDecorator<T> {
  /**
   * define class decorator setting with params.
   *
   * @param {(Registration<any> | symbol | string)} provide define this class provider for provide.
   * @param {string} [alias] define this class provider with alias for provide.
   * @param {boolean} [singlton] define this class as singlton.
   * @param {number} [cache]  define class cahce expris when is not singlton.
   */
  (
    provide: Registration<any> | symbol | string,
    alias?: string,
    singlton?: boolean,
    cache?: number
  ): ClassDecorator;
}

/**
 * create class decorator
 *
 */
export function createClassDecorator<T extends ClassMetadata>(
  name: string,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IClassDecorator<T> {
  let classAdapter = (args: ArgsIterator) => {
    let metadata;
    if (adapter) {
      adapter(args);
    }
    args.next<T>({
      // isMetadata: (arg) => isClassMetadata(arg),
      match: arg =>
        arg &&
        (isSymbol(arg) ||
          isString(arg) ||
          (isObject(arg) && arg instanceof Registration)),
      setMetadata: (metadata, arg) => {
        metadata.provide = arg;
      },
    });

    args.next<T>({
      match: arg => isString(arg),
      setMetadata: (metadata, arg) => {
        metadata.alias = arg;
      },
    });

    args.next<T>({
      match: arg => isBoolean(arg),
      setMetadata: (metadata, arg) => {
        metadata.singleton = arg;
      },
    });

    args.next<T>({
      match: arg => isNumber(arg),
      setMetadata: (metadata, arg) => {
        metadata.expires = arg;
      },
    });
  };
  let decorator = createDecorator<T>(name, classAdapter, metadataExtends);
  decorator.decoratorType = DecoratorType.Class;
  return decorator;
}
