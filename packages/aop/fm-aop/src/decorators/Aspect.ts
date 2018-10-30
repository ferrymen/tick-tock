import {
  createClassDecorator,
  isArray,
  isClass,
  ITypeDecorator,
  Type,
  Registration,
  isString,
} from '@ferrymen/fm-ioc-core';
import { AspectMetadata } from '../metadatas';

/**
 * Aspect decorator
 *
 */
export interface IAspectDecorator extends ITypeDecorator<AspectMetadata> {
  /**
   * Aspect decorator, define for class.  use to define class as aspect. it can setting provider to some token, singleton or not.
   *
   * @Aspect
   *
   */
  (
    annotation: string,
    within?: Type<any> | Type<any>[],
    provide?: Registration<any> | symbol | string,
    alias?: string,
    singlton?: boolean,
    cache?: number
  ): ClassDecorator;

  /**
   * Aspect decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
   *
   * @Aspect
   *
   * @param {AspectMetadata} [metadata] metadata map.
   */
  (metadata?: AspectMetadata): ClassDecorator;
}

/**
 * Aspect decorator. define aspect service.
 *
 * @Aspect
 */
export const Aspect: IAspectDecorator = createClassDecorator<AspectMetadata>(
  'Aspect',
  args => {
    args.next<AspectMetadata>({
      match: arg => isString(arg),
      setMetadata: (metadata, arg) => {
        metadata.annotation = arg;
      },
    });

    args.next<AspectMetadata>({
      match: arg => isArray(arg) || isClass(arg),
      setMetadata: (metadata, arg) => {
        metadata.within = arg;
      },
    });
  }
) as IAspectDecorator;
