import { PropertyMetadata } from './PropertyMetadata';

export interface ParameterMetadata extends PropertyMetadata {
  /**
   * parameter index.
   *
   */
  index?: number;

  /**
   * default value
   *
   */
  defaultValue?: object;
}
