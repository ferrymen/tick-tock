import { MapSet, isToken, isObject } from '../../utils';

import {
  Token,
  Factory,
  SymbolType,
  Providers,
  ToInstance,
  Express2,
} from '../../types';

import { isUndefined, isFunction, isNumber } from 'util';
import { IContainer } from '../../IContainer';
import { InjectToken } from '../../InjectToken';

export const ProviderMapToken = new InjectToken<ProviderMap>('DI_ProviderMap');

/**
 * Provider Map
 */
export class ProviderMap {
  private maps: MapSet<Token<any> | number, Factory<any>>;
  constructor(private container: IContainer) {
    this.maps = new MapSet<Token<any> | number, Factory<any>>();
  }

  has(provide: Token<any> | number): boolean {
    return this.maps.has(this.getTokenKey(provide));
  }

  getTokenKey(token: Token<any> | number): SymbolType<any> | number {
    if (isToken(token)) {
      return this.container.getTokenKey(token);
    }
    return token;
  }

  get<T>(provide: Token<T> | number): Token<T> | Factory<T> {
    return this.maps.get(this.getTokenKey(provide));
  }

  add<T>(provide: Token<T> | number, provider: Token<T> | Factory<T>): this {
    let key = this.getTokenKey(provide);
    if (isUndefined(key)) {
      return this;
    }
    let factory;
    if (isToken(provider) && this.container.has(provider)) {
      factory = (...providers: Providers[]) => {
        return this.container.resolve(provider, ...providers);
      };
    } else {
      if (isFunction(provider)) {
        factory = (...providers: Providers[]) => {
          return (<ToInstance<any>>provider)(this.container, ...providers);
        };
      } else {
        factory = () => {
          return provider;
        };
      }
    }
    this.maps.set(key, factory);
    return this;
  }

  remove<T>(provide: Token<T> | number): this {
    let key = this.getTokenKey(provide);
    if (this.maps.has(key)) {
      this.maps.delete(key);
    }
    return this;
  }

  resolve<T>(provide: Token<T> | number, ...providers: Providers[]): T {
    let key = this.getTokenKey(provide);
    if (this.maps.has(key)) {
      let provider = this.maps.get(key);
      return isToken(provider)
        ? this.container.resolve(provider, ...providers)
        : provider(...providers);
    } else {
      return !isNumber(key) && this.container.has(key)
        ? this.container.resolve(key, ...providers)
        : null;
    }
  }

  forEach(
    express: Express2<Factory<any>, Token<any> | number, void | boolean>
  ) {
    this.maps.forEach(express);
  }

  copy(map: ProviderMap) {
    if (!map) {
      return;
    }
    map.forEach((val: any, token: any) => {
      this.maps.set(token, val);
    });
  }
}

/**
 * object is provider map or not.
 *
 */
export function isProviderMap(target: object): target is ProviderMap {
  if (!isObject(target)) {
    return false;
  }
  return target instanceof ProviderMap;
}
