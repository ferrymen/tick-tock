import { Registration } from '../../Registration';
import { InjectableMetadata } from '../metadatas';
import { ITypeDecorator, createClassDecorator } from '../factories';

/**
 * Injectable decorator
 *
 * @export
 * @interface IInjectableDecorator
 * @extends {IClassDecorator<InjectableMetadata>}
 */
export interface IInjectableDecorator
  extends ITypeDecorator<InjectableMetadata> {
  /**
   * Injectable decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
   *
   */
  (
    provide: Registration<any> | symbol | string,
    alias?: string,
    singlton?: boolean,
    cache?: number
  ): ClassDecorator;

  /**
   * Injectable decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
   *
   */
  (metadata?: InjectableMetadata): ClassDecorator;
}

/**
 * Injectable decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
 *
 */
export const Injectable: IInjectableDecorator = createClassDecorator<
  InjectableMetadata
>('Injectable');
