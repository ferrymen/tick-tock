import { Metadate } from './Metadate';
import { Providers } from '../../types';

/**
 * method metadata
 *
 * @export
 * @interface PropMetadata
 */
export interface MethodMetadata extends Metadate {
  /**
   * param providers
   *
   */
  providers?: Providers[];
  /**
   * method property key
   *
   */
  propertyKey?: string;

  // /**
  //  * method parameter names
  //  *
  //  */
  // parameterNames?: string[];
  // descriptor?: TypedPropertyDescriptor<any>;
}
