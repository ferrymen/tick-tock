import { IContainer } from './IContainer';
import { LifeScopeToken } from './LifeScope';
import { CacheManagerToken } from './ICacheManager';
import { ResolverChainToken, ResolverChain } from './resolves';
import { ProviderMap, ProviderMapToken } from './core/providers';
import { ProviderParserToken } from './core/IProviderParser';
import { MethodAccessorToken } from './IMethodAccessor';
import { DefaultLifeScope, ProviderParser, MethodAccessor } from './core';
import { CacheManager } from './core/CacheManager';

/**
 * register core for container.
 *
 */
export function registerCores(container: IContainer) {
  container.registerSingleton(
    CacheManagerToken,
    () => new CacheManager(container)
  );
  container.registerSingleton(
    ResolverChainToken,
    () => new ResolverChain(container)
  );
  container.register(ProviderMapToken, () => new ProviderMap(container));
  container.bindProvider(ProviderMap, ProviderMapToken);
  container.registerSingleton(
    ProviderParserToken,
    () => new ProviderParser(container)
  );

  container.register(Date, () => new Date());
  container.register(String, () => '');
  container.register(Number, () => Number.NaN);
  container.register(Boolean, () => undefined);
  container.register(Array, () => []);
}