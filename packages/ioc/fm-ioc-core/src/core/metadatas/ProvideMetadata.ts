import { Token } from '../../types';
import { TypeMetadata } from './TypeMetadata';

/**
 * provide type from.
 *
 */
export interface ProvideMetadata extends TypeMetadata {
  /**
   * this type provide from.
   *
   */
  provider?: Token<any>;

  /**
   * alias name. use to create Registration with provider.
   *
   */
  alias?: string;
}
