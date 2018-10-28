import { createClassDecorator, ITypeDecorator } from '../factories';
import { AutorunMetadata } from '../metadatas';
import { isClassMetadata, isString } from '../../utils';

/**
 * IocExt decorator. define for class, use to define the class is Ioc extends module. it will auto run after registered to helper your to setup module.
 *
 */
export interface IocExtDecorator extends ITypeDecorator<AutorunMetadata> {
  /**
   * IocExt decorator. define for class, use to define the class is Ioc extends module. it will auto run after registered to helper your to setup module.
   *
   */
  (autorun?: string): ClassDecorator;

  /**
   * IocExt decorator. define for class, use to define the class is Ioc extends module. it will auto run after registered to helper your to setup module.
   *
   */
  (metadata?: AutorunMetadata): ClassDecorator;
}

/**
 * IocExt decorator. define for class, use to define the class is Ioc extends module. it will auto run after registered to helper your to setup module.
 *
 */
export const IocExt: IocExtDecorator = createClassDecorator<AutorunMetadata>(
  'IocExt',
  args => {
    args.next<AutorunMetadata>({
      isMetadata: arg => isClassMetadata(arg, ['autorun']),
      match: arg => isString(arg),
      setMetadata: (metadata, arg) => {
        metadata.autorun = arg;
      },
    });
  },
  metadata => {
    metadata.singleton = true;
    return metadata;
  }
) as IocExtDecorator;

export const IocModule = IocExt;
