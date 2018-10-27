import { MapSet } from '../utils';
import { Type } from '../types';
import { IContainer } from '../IContainer';
import { ICacheManager } from '../ICacheManager';

/**
 * cache target.
 *
 */
export interface CacheTarget {
  target: any;
  expires: number;
}

/**
 * cache manager.
 *
 */
export class CacheManager implements ICacheManager {
  hasCache(targetType: Type<any>): boolean {
    throw new Error('Method not implemented.');
  }
  cache(targetType: Type<any>, target: any, expires: number) {
    throw new Error('Method not implemented.');
  }
  get(targetType: Type<any>, expires?: number) {
    throw new Error('Method not implemented.');
  }
  isChecking(): boolean {
    throw new Error('Method not implemented.');
  }
  checkExpires() {
    throw new Error('Method not implemented.');
  }
  destroy(targetType: Type<any>, target?: any) {
    throw new Error('Method not implemented.');
  }
  cacheTokens: MapSet<Type<any>, CacheTarget>;
  constructor(private container: IContainer) {
    this.cacheTokens = new MapSet();
  }
}
