import { IParameter } from '../IParameter';
import { Type, Token, Providers } from '../types';
import { ProviderMap } from './providers/ProviderMap';

/**
 * the action execute data
 */
export interface ActionData<T> {
  args?: any[];
  /**
   * args params types
   */
  params?: IParameter[];

  /**
   * target instance
   */
  target?: any;

  /**
   * target type.
   */
  targetType?: Type<any>;

  /**
   * resolve token.
   */
  tokenKey?: Token<any>;

  /**
   * is target singleton or not.
   */
  singleton?: boolean;

  /**
   * property or method name of type.
   */
  propertyKey?: string;

  /**
   * action execute result.
   */
  execResult?: T;

  /**
   * exter providers for resolve. origin providers
   */
  providers?: Providers[];

  /**
   * exter providers convert to map.
   */
  providerMap?: ProviderMap;
}
