import { Token } from '../../types';
import { TypeMetadata } from './TypeMetadata';

/**
 * provider type to.
 *
 */
export interface ProviderMetadata extends TypeMetadata {
  /**
   * this type provider to.
   *
   * @type {SymbolType<any>}
   * @memberof Provider
   */
  provide?: Token<any>;
  alias?: string;
}
