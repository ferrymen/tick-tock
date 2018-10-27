import 'reflect-metadata';
import { IContainer, ContainerToken } from './IContainer';
import {
  MapSet,
  isClass,
  isToken,
  isFunction,
  Lang,
  isUndefined,
  isString,
  isSymbol,
} from './utils';
import {
  Type,
  Token,
  Providers,
  SymbolType,
  Factory,
  ToInstance,
  Modules,
  LoadType,
} from './types';
import { IContainerBuilder, ContainerBuilderToken } from './IContainerBuilder';
import { ResolverChain, ResolverChainToken } from './resolves';
import { Registration } from './Registration';
import { LifeScope, LifeScopeToken } from './LifeScope';
import { IParameter } from './IParameter';
import { ActionComponent } from './core/actions';
import { CacheManagerToken } from './ICacheManager';
import { MethodAccessorToken } from './IMethodAccessor';
import { registerCores } from './registerCores';

export class Container implements IContainer {
  protected provideTypes!: MapSet<Token<any>, Type<any>>;
  protected factories!: MapSet<Token<any>, Function>;
  protected singleton!: MapSet<Token<any>, any>;

  /**
   * parent container.
   *
   */
  parent!: IContainer;

  constructor() {
    this.init();
  }

  getRoot(): IContainer {
    let root: IContainer = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }

  getBuilder(): IContainerBuilder {
    return this.resolveValue(ContainerBuilderToken);
  }

  /**
   * Retrieves an instance from the container based on the provided token.
   *
   */
  get<T>(token: Token<T>, alias?: string, ...providers: Providers[]): T {
    return this.resolve(
      alias ? this.getTokenKey<T>(token, alias) : token,
      ...providers
    );
  }

  /**
   * resolve token value in this container only.
   *
   */
  get resolvers(): ResolverChain {
    return this.resolveValue(ResolverChainToken);
  }

  /**
   * resolve type instance with token and param provider.
   *
   */
  resolve<T>(token: Token<T>, ...providers: Providers[]): T {
    let key = this.getTokenKey<T>(token);
    return this.resolvers.resolve(key, ...providers) as T;
  }

  /**
   * resolve token value in this container only.
   *
   */
  resolveValue<T>(token: Token<T>, ...providers: Providers[]): T {
    let key = this.getTokenKey(token);
    if (!this.hasRegister(key)) {
      return null;
    }
    let factory = this.factories.get(key);
    return factory(...providers) as T;
  }

  /**
   * clear cache.
   *
   */
  clearCache(targetType: Type<any>) {
    this.resolveValue(CacheManagerToken).destroy(targetType);
  }

  /**
   * get token.
   *
   */
  getToken<T>(token: Token<T>, alias?: string): Token<T> {
    if (alias) {
      return new Registration(token, alias);
    }
    return token;
  }

  /**
   * get tocken key.
   *
   */
  getTokenKey<T>(token: Token<T>, alias?: string): SymbolType<T> {
    if (alias) {
      return new Registration(token, alias).toString();
    } else if (token instanceof Registration) {
      return token.toString();
    }
    return token;
  }

  /**
   * register type.
   */
  register<T>(token: Token<T>, value?: Factory<T>): this {
    this.registerFactory(token, value);
    return this;
  }

  /**
   * has register the token or not.
   *
   */
  has<T>(token: Token<T>, alias?: string): boolean {
    let key = this.getTokenKey(token, alias);
    return this.resolvers.has(key);
  }

  /**
   * has register type.
   *
   */
  hasRegister<T>(key: SymbolType<T>) {
    return this.factories.has(key);
  }

  /**
   * unregister the token
   *
   */
  unregister<T>(token: Token<T>, inchain?: boolean): this {
    let key = this.getTokenKey(token);
    if (inchain === false) {
      if (this.hasRegister(key)) {
        this.factories.delete(key);
        if (this.provideTypes.has(key)) {
          this.provideTypes.delete(key);
        }
        if (isClass(key)) {
          this.clearCache(key);
        }
      }
    } else {
      this.resolvers.unregister(key);
    }
    return this;
  }

  /**
   * register stingleton type.
   *
   */
  registerSingleton<T>(token: Token<T>, value?: Factory<T>): this {
    this.registerFactory(token, value, true);
    return this;
  }

  /**
   * register value.
   *
   */
  registerValue<T>(token: Token<T>, value: T): this {
    let key = this.getTokenKey(token);

    this.singleton.set(key, value);
    if (!this.factories.has(key)) {
      this.factories.set(key, () => {
        return this.singleton.get(key);
      });
    }

    return this;
  }

  /**
   * bind provider.
   *
   */
  bindProvider<T>(provide: Token<T>, provider: Token<T> | Factory<T>): this {
    let provideKey = this.getTokenKey(provide);
    let factory;
    if (isToken(provider)) {
      factory = (...providers: Providers[]) => {
        return this.resolve(provider, ...providers);
      };
    } else {
      if (isFunction(provider)) {
        factory = (...providers: Providers[]) => {
          return (<ToInstance<any>>provider)(this, ...providers);
        };
      } else {
        factory = () => {
          return provider;
        };
      }
    }
    if (isClass(provider)) {
      if (!this.has(provider)) {
        this.register(provider);
      }
      this.provideTypes.set(provideKey, provider);
    } else if (isToken(provider)) {
      let token = provider;
      while (this.provideTypes.has(token) && !isClass(token)) {
        token = this.provideTypes.get(token) as any;
        if (isClass(token)) {
          this.provideTypes.set(provideKey, token);
          break;
        }
      }
    }

    this.factories.set(provideKey, factory);
    return this;
  }

  /**
   * get token implements class type.
   *
   */
  getTokenImpl<T>(token: Token<T>, inchain?: boolean): Type<T> {
    let tokenKey = this.getTokenKey(token);
    if (inchain === false) {
      if (isClass(token)) {
        return token;
      }
      if (this.provideTypes.has(tokenKey)) {
        return this.provideTypes.get(tokenKey);
      }
      return null;
    } else {
      return this.resolvers.getTokenImpl(tokenKey);
    }
  }

  /**
   * get token implement class and base classes.
   *
   */
  getTokenExtendsChain(token: Token<any>): Token<any>[] {
    if (isClass(token)) {
      return this.getBaseClasses(token);
    } else {
      return this.getBaseClasses(this.getTokenImpl(token)).concat([token]);
    }
  }

  protected getBaseClasses(target: Function): Token<any>[] {
    let types: Type<any>[] = [];
    while (isClass(target) && target !== Object) {
      types.push(target);
      target = Lang.getParentClass(target);
    }
    return types;
  }

  /**
   * get target reference service.
   *
   */
  getRefService<T>(
    refServiceInject: Type<Registration<T>>,
    target: Token<any>,
    defaultToken?: Token<T>,
    ...providers: Providers[]
  ): T {
    let service: T;
    this.getTokenExtendsChain(target).forEach(tk => {
      if (service) {
        return false;
      }
      let serviceToken = new refServiceInject(tk);
      if (this.has(serviceToken)) {
        service = this.resolve(serviceToken, ...providers);
      }
      return true;
    });
    if (!service && defaultToken && this.has(defaultToken)) {
      service = this.resolve(defaultToken, ...providers);
    }
    return service;
  }

  /**
   * get life scope of container.
   *
   */
  getLifeScope(): LifeScope {
    return this.get(LifeScopeToken);
  }

  /**
   * use modules.
   *
   */
  use(...modules: Modules[]): this {
    this.getBuilder().syncLoadModule(this, ...modules);
    return this;
  }

  /**
   * async use modules.
   *
   */
  loadModule(...modules: LoadType[]): Promise<Type<any>[]> {
    return this.getBuilder().loadModule(this, ...modules);
  }

  /**
   * invoke method async.
   *
   */
  invoke<T>(
    token: Token<any>,
    propertyKey: string,
    instance?: any,
    ...providers: Providers[]
  ): Promise<T> {
    return this.resolveValue(MethodAccessorToken).invoke(
      token,
      propertyKey,
      instance,
      ...providers
    );
  }

  /**
   * invoke method.
   *
   */
  syncInvoke<T>(
    token: Token<any>,
    propertyKey: string,
    instance?: any,
    ...providers: Providers[]
  ): T {
    return this.resolveValue(MethodAccessorToken).syncInvoke(
      token,
      propertyKey,
      instance,
      ...providers
    );
  }

  createSyncParams(params: IParameter[], ...providers: Providers[]): any[] {
    return this.resolveValue(MethodAccessorToken).createSyncParams(
      params,
      ...providers
    );
  }

  createParams(
    params: IParameter[],
    ...providers: Providers[]
  ): Promise<any[]> {
    return this.resolveValue(MethodAccessorToken).createParams(
      params,
      ...providers
    );
  }

  protected cacheDecorator<T>(
    map: MapSet<string, ActionComponent>,
    action: ActionComponent
  ) {
    if (!map.has(action.name)) {
      map.set(action.name, action);
    }
  }

  protected init() {
    this.factories = new MapSet<Token<any>, Function>();
    this.singleton = new MapSet<Token<any>, any>();
    this.provideTypes = new MapSet<Token<any>, Type<any>>();
    this.bindProvider(ContainerToken, () => this);

    registerCores(this);
  }

  protected registerFactory<T>(
    token: Token<T>,
    value?: Factory<T>,
    singleton?: boolean
  ) {
    let key = this.getTokenKey(token);

    if (this.factories.has(key)) {
      return;
    }

    let classFactory;
    if (!isUndefined(value)) {
      if (isFunction(value)) {
        if (isClass(value)) {
          this.bindTypeFactory(key, value as Type<T>, singleton);
        } else {
          classFactory = this.createCustomFactory(
            key,
            value as ToInstance<T>,
            singleton
          );
        }
      } else if (singleton && value !== undefined) {
        classFactory = this.createCustomFactory(key, () => value, singleton);
      }
    } else if (!isString(token) && !isSymbol(token)) {
      let ClassT = token instanceof Registration ? token.getClass() : token;
      if (isClass(ClassT)) {
        this.bindTypeFactory(key, ClassT as Type<T>, singleton);
      }
    }

    if (classFactory) {
      this.factories.set(key, classFactory);
    }
  }

  protected createCustomFactory<T>(
    key: SymbolType<T>,
    factory?: ToInstance<T>,
    singleton?: boolean
  ) {
    return singleton
      ? (...providers: Providers[]) => {
          if (this.singleton.has(key)) {
            return this.singleton.get(key);
          }
          let instance = (factory as ToInstance<T>)(this, ...providers);
          this.singleton.set(key, instance);
          return instance;
        }
      : (...providers: Providers[]) =>
          (factory as ToInstance<T>)(this, ...providers);
  }

  protected bindTypeFactory<T>(
    key: SymbolType<T>,
    ClassT?: Type<T>,
    singleton?: boolean
  ) {}
}
