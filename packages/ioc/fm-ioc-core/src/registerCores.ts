import { IContainer } from './IContainer';
import { LifeScopeToken } from './LifeScope';
import { CacheManagerToken } from './ICacheManager';
import { ResolverChainToken, ResolverChain } from './resolves';
import { ProviderMap, ProviderMapToken } from './core/providers';
import { ProviderParserToken } from './core/IProviderParser';
import { MethodAccessorToken } from './IMethodAccessor';
import {
  DefaultLifeScope,
  ProviderParser,
  MethodAccessor,
  CoreActions,
  AutoWired,
  Injectable,
  Singleton,
  Inject,
  Param,
} from './core';
import { CacheManager } from './core/CacheManager';

/**
 * register core for container.
 *
 */
export function registerCores(container: IContainer) {
  container.registerSingleton(
    LifeScopeToken,
    () => new DefaultLifeScope(container)
  );
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
  container.registerSingleton(
    MethodAccessorToken,
    () => new MethodAccessor(container)
  );

  let lifeScope = container.get(LifeScopeToken);

  lifeScope.registerDecorator(
    Injectable,
    CoreActions.bindProvider,
    CoreActions.cache
  );
  lifeScope.registerDecorator(Singleton, CoreActions.bindProvider);

  // interpret @AutoWired
  lifeScope.registerDecorator(
    AutoWired,
    CoreActions.bindParameterType,
    CoreActions.bindPropertyType
  );

  lifeScope.registerDecorator(
    Inject,
    CoreActions.bindParameterType,
    CoreActions.bindPropertyType
  );
  lifeScope.registerDecorator(
    Param,
    CoreActions.bindParameterType,
    CoreActions.bindPropertyType
  );

  container.register(Date, () => new Date());
  container.register(String, () => '');
  container.register(Number, () => Number.NaN);
  container.register(Boolean, () => undefined);
  container.register(Array, () => []);
}
