import { Token, Type } from '../types';
import { IContainer } from '../IContainer';
import { Container } from '../Container';

export interface IExports {
  /**
   * export token of type
   */
  token?: Token<any>;

  /**
   * exports module type
   */
  type?: Type<any>;

  /**
   * exports modules
   */
  exports?: Token<any>[];

  /**
   * exports providers
   */
  providers?: Token<any>[];

  /**
   * ioc container, the module defined in
   */
  container?: IContainer;
}

/**
 * resolver type
 */
export type ResolverType = Container | IExports;
