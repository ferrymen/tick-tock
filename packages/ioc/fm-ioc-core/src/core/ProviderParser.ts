import { IProviderParser } from './IProviderParser';
import { IContainer } from '../IContainer';
import { Providers } from '../types';
import {
  ProviderMap,
  ProviderMapToken,
  Provider,
  ParamProvider,
  isProviderMap,
} from './providers';
import {
  isUndefined,
  isNull,
  isNumber,
  isClass,
  isBaseObject,
  isToken,
  isArray,
  isFunction,
  Lang,
  isString,
} from '../utils';

/**
 * provider matcher. use to find custome providers in resolve.
 *
 */
export class ProviderParser implements IProviderParser {
  constructor(private container: IContainer) {}

  parse(...providers: Providers[]): ProviderMap {
    if (providers.length === 1 && isProviderMap(providers[0])) {
      return providers[0] as ProviderMap;
    }
    let map = this.container.resolve(ProviderMapToken);
    providers.forEach((p, index) => {
      if (isUndefined(p) || isNull(p)) {
        return;
      }
      if (isProviderMap(p)) {
        map.copy(p);
      } else if (p instanceof Provider) {
        if (p instanceof ParamProvider) {
          if (!p.type && isNumber(p.index)) {
            map.add(p.index, (...providers: Providers[]) =>
              p.resolve(this.container, ...providers)
            );
          } else {
            map.add(p.type, (...providers: Providers[]) =>
              p.resolve(this.container, ...providers)
            );
          }
        } else {
          map.add(p.type, (...providers: Providers[]) =>
            p.resolve(this.container, ...providers)
          );
        }
      } else if (isClass(p)) {
        if (!this.container.has(p)) {
          this.container.register(p);
        }
        map.add(p, p);
      } else if (isBaseObject(p)) {
        let pr: any = p;
        let isobjMap = false;
        if (isToken(pr.provide)) {
          if (isArray(pr.deps) && pr.deps.length) {
            pr.deps.forEach(d => {
              if (isClass(d) && !this.container.has(d)) {
                this.container.register(d);
              }
            });
          }
          if (!isUndefined(pr.useValue)) {
            map.add(pr.provide, () => pr.useValue);
          } else if (isClass(pr.useClass)) {
            if (!this.container.has(pr.useClass)) {
              this.container.register(pr.useClass);
            }
            map.add(pr.provide, pr.useClass);
          } else if (isFunction(pr.useFactory)) {
            map.add(pr.provide, () => {
              let args = [];
              if (isArray(pr.deps) && pr.deps.length) {
                args = pr.deps.map(d => {
                  if (isClass(d)) {
                    return this.container.get(d);
                  } else {
                    return d;
                  }
                });
              }
              return pr.useFactory.apply(pr, args);
            });
          } else if (isToken(pr.useExisting)) {
            if (this.container.has(pr.useExisting)) {
              map.add(pr.provide, () => this.container.resolve(pr.useExisting));
            } else {
              console.log('has not register:', pr.useExisting);
            }
          } else {
            isobjMap = true;
          }
        } else {
          isobjMap = true;
        }

        if (isobjMap) {
          Lang.forIn<any>(p, (val, name) => {
            if (!isUndefined(val)) {
              if (isClass(val)) {
                map.add(name, val);
              } else if (isFunction(val) || isString(val)) {
                map.add(name, () => val);
              } else {
                map.add(name, val);
              }
            }
          });
        }
      } else if (isFunction(p)) {
        map.add(name, () => p);
      } else {
        map.add(index, p);
      }
    });

    return map;
  }
}
