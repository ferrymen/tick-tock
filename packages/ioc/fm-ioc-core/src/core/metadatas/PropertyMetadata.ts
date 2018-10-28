import { ProvideMetadata } from './ProvideMetadata';

/**
 * property metadata
 *
 */
export interface PropertyMetadata extends ProvideMetadata {
  /**
   * property name
   *
   */
  propertyKey?: string;
}
