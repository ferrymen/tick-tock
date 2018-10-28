import { SymbolType } from '../../types';
import { Metadate } from './Metadate';

/**
 * type metadata
 *
 */
export interface TypeMetadata extends Metadate {
  /**
   * property type
   *
   */
  type?: SymbolType<any>;
}
