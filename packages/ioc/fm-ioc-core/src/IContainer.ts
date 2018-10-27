import { IResolver } from './IResolver';
import { IMethodAccessor } from './IMethodAccessor';
import { ResolverChain } from './resolves/ResolverChain';
import { IContainerBuilder } from './IContainerBuilder';
import {
  Token,
  SymbolType,
  Providers,
  Type,
  Factory,
  LoadType,
  Modules,
} from './types';
import { Registration } from './Registration';
import { LifeScope } from './LifeScope';
import { InjectToken } from './InjectToken';

/**
 * IContainer token.
 * it is a symbol id, you can use  @Inject, @Autowried or @Param to get container instance in yourself class.
 */
export const ContainerToken = new InjectToken<IContainer>('DI_IContainer');

export interface IContainer extends IMethodAccessor, IResolver {
  /**
   * parant container
   */
  parent: IContainer;

  /**
   * get root container
   */
  getRoot(): IContainer;

  readonly resolvers: ResolverChain;

  /**
   * get container builder of this container
   */
  getBuilder(): IContainerBuilder;

  /**
   * has register the token or not
   *
   * @param token
   * @param alias
   */
  has<T>(token: Token<T>, alias?: string): boolean;

  /**
   * current container has register
   *
   * @param key
   */
  hasRegister<T>(key: SymbolType<T>): boolean;

  /**
   * Retrieves an instance from the container based on the provided token
   *
   * @param token
   * @param alias
   * @param providers
   */
  get<T>(token: Token<T>, alias?: string, ...providers: Providers[]): T;

  /**
   * resolve token value in this container only.
   *
   * @param token
   * @param providers
   */
  resolveValue<T>(token: Token<T>, ...providers: Providers[]): T;

  /**
   * clear cache
   *
   * @param targetType
   */
  clearCache(targetType: Type<any>): void;

  /**
   * get token
   *
   * @param target
   * @param alias
   */
  getToken<T>(target: Token<T>, alias?: string): Token<T>;

  /**
   * get tocken key
   *
   * @param token
   * @param alias
   */
  getTokenKey<T>(token: Token<T>, alias?: string): SymbolType<T>;

  /**
   * get token implement class type.
   *
   * @param token
   * @param inchain
   */
  getTokenImpl<T>(token: Token<T>, inchain?: boolean): Type<T>;

  /**
   * get target reference service
   *
   * @param refServiceInject
   * @param target
   * @param defaultToken
   * @param providers
   */
  getRefService<T>(
    refServiceInject: Type<Registration<T>>,
    target: Token<any>,
    defaultToken?: Token<T>,
    ...providers: Providers[]
  ): T;

  /**
   * get token implement class and base classes
   *
   * @param token
   */
  getTokenExtendsChain(token: Token<any>): Token<any>[];

  /**
   * register type
   *
   * @param token
   * @param value
   */
  register<T>(token: Token<T>, value?: Factory<T>): this;

  unregister<T>(token: Token<T>, inchain?: boolean): this;

  bindProvider<T>(provide: Token<T>, provider: Token<T> | Factory<T>): this;

  registerSingleton<T>(token: Token<T>, value?: Factory<T>): this;

  registerValue<T>(token: Token<T>, value: T): this;

  /**
   * get life scope of container
   */
  getLifeScope(): LifeScope;

  /**
   * use modules
   *
   * @param modules
   */
  use(...modules: Modules[]): this;

  loadModule(...modules: LoadType[]): Promise<Type<any>[]>;
}
