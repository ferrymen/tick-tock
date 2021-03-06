import { Providers } from '../types';
import { ProviderMap } from './providers';
import { InjectToken } from '../InjectToken';

/**
 * Providers parser token.
 */
export const ProviderParserToken = new InjectToken<IProviderParser>(
  'DI_IProviderParser'
);

/**
 * Providers Parser interface.
 *
 */
export interface IProviderParser {
  /**
   * convert to provider map.
   *
   */
  parse(...providers: Providers[]): ProviderMap;
}
