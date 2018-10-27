import { IMethodAccessor } from '../IMethodAccessor';
import { IProviderParser, ProviderParserToken } from './IProviderParser';
import { Token, Providers } from '../types';
import { IContainer } from '..';
import { isFunction } from 'util';
import { IParameter } from '../IParameter';
import { isToken } from '../utils';

/**
 * method accessor
 *
 */
export class MethodAccessor {
  constructor(private container: IContainer) {}

  getMatcher(): IProviderParser {
    return this.container.get(ProviderParserToken);
  }

  createSyncParams(params: IParameter[], ...providers: Providers[]): any[] {
    let providerMap = this.getMatcher().parse(params, ...providers);
    return params.map((param, index) => {
      if (param.name && providerMap.has(param.name)) {
        return providerMap.resolve(param.name);
      } else if (isToken(param.type)) {
        if (providerMap.has(param.type)) {
          return providerMap.resolve(param.type);
        }
        return this.container.resolve(param.type, providerMap);
      } else {
        return undefined;
      }
    });
  }

  createParams(
    params: IParameter[],
    ...providers: Providers[]
  ): Promise<any[]> {
    let providerMap = this.getMatcher().parse(params, ...providers);
    return Promise.all(
      params.map((param, index) => {
        if (param.name && providerMap.has(param.name)) {
          return providerMap.resolve(param.name);
        } else if (isToken(param.type)) {
          if (providerMap.has(param.type)) {
            return providerMap.resolve(param.type);
          }
          return this.container.resolve(param.type, providerMap);
        } else {
          return undefined;
        }
      })
    );
  }
}
