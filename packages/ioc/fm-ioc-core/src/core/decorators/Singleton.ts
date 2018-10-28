import { createClassDecorator, ITypeDecorator } from '../factories';
import { ClassMetadata } from '../metadatas';
import { Registration } from '../../Registration';

/**
 * Singleton decorator, for class. use to define the class is singleton.
 *
 */
export interface ISingletonDecorator extends ITypeDecorator<ClassMetadata> {
  /**
   * Singleton decorator, for class. use to define the class is singleton.
   *
   */
  (
    provide: Registration<any> | symbol | string,
    alias?: string
  ): ClassDecorator;

  /**
   * Singleton decorator, for class. use to define the class is singleton.
   *
   */
  (metadata?: ClassMetadata): ClassDecorator;
}

/**
 * Singleton decorator, for class. use to define the class is singleton.
 *
 */
export const Singleton: ISingletonDecorator = createClassDecorator<
  ClassMetadata
>('Singleton', null, metadata => {
  metadata.singleton = true;
  return metadata;
}) as ISingletonDecorator;
