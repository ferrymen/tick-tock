import { Token, Providers } from './types';
import { IParameter } from './IParameter';
import { InjectToken } from './InjectToken';

/**
 * IMethodAccessor interface symbol.
 * it is a symbol id, you can register yourself MethodAccessor for this.
 */
export const MethodAccessorToken = new InjectToken<IMethodAccessor>(
  'DI_IMethodAccessor'
);

export interface IMethodAccessor {
  /**
   * try to async invoke the method of instance, if no instance will create by type
   *
   * @param token
   * @param propertyKey
   * @param target
   * @param providers
   */
  invoke<T>(
    token: Token<any>,
    propertyKey: string,
    target?: any,
    ...providers: Providers[]
  ): Promise<T>;

  /**
   *  try to invoke the method of instance, if no instance will create by type
   *
   * @param token
   * @param propertyKey
   * @param target
   * @param providers
   */
  syncInvoke<T>(
    token: Token<any>,
    propertyKey: string,
    target?: any,
    ...providers: Providers[]
  ): T;

  /**
   * create params instances with IParameter and provider
   * @param params
   * @param providers
   */
  createParams(params: IParameter[], ...providers: Providers[]): Promise<any[]>;

  /**
   *
   * @param params
   * @param providers
   */
  createSyncParams(params: IParameter[], ...providers: Providers[]): any[];
}
