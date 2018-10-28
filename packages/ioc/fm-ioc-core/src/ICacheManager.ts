import { InjectToken } from './InjectToken';
import { Type } from './types';

/**
 * ICacheManager interface token.
 * it is a token id, you can register yourself ICacheManager for this.
 */
export const CacheManagerToken = new InjectToken<ICacheManager>(
  'DI_ICacheManager'
);

/**
 * cache manager inteface.
 */
export interface ICacheManager {
  /**
   * has cache
   *
   */
  hasCache(targetType: Type<any>): boolean;
  /**
   * cache target.
   *
   */
  cache(targetType: Type<any>, target: any, expires: number);
  /**
   * get cache target, if set expires will refresh cache timeout.
   *
   */
  get(targetType: Type<any>, expires?: number): any;

  /**
   * is check expires or not.
   *
   */
  isChecking(): boolean;
  /**
   * run check expires.
   *
   */
  checkExpires();
  /**
   * destory cache
   *
   */
  destroy(targetType: Type<any>, target?: any);
}
