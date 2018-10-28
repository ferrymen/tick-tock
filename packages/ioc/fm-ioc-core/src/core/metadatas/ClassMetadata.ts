import { ProviderMetadata } from './ProviderMetadata';

/**
 * class metadata.
 *
 */
export interface ClassMetadata extends ProviderMetadata {
  /**
   * is singleton or not.
   *
   */
  singleton?: boolean;
  /**
   * class package name.
   *
   */
  package?: string;

  /**
   * class cache timeout when not used.
   *
   */
  expires?: number;
}
