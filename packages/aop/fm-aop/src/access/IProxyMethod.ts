import { InjectToken, Type } from '@ferrymen/fm-ioc-core';
import { IPointcut, Joinpoint } from '../joinpoints';

/**
 * Aop proxy method interface token.
 * it is a token id, you can register yourself IProxyMethod for this.
 */
export const ProxyMethodToken = new InjectToken<IProxyMethod>(
  'DI_IProxyMethod'
);

/**
 * proxy method, for proxy advice method.
 *
 */
export interface IProxyMethod {
  /**
   * proceed the proxy method.
   *
   */
  proceed(
    target: any,
    targetType: Type<any>,
    pointcut: IPointcut,
    provJoinpoint?: Joinpoint
  );
}
