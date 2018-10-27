import { IContainer } from './IContainer';
import { ProviderMap } from './core/providers/ProviderMap';
import { Registration } from './Registration';

export interface ClassAnnations {
  /**
   * class name
   *
   * @type {string}
   * @memberof ClassAnnations
   */
  name: string;
  /**
   * class params declaration.
   *
   * @type {ObjectMap<string[]>}
   * @memberof ClassAnnations
   */
  params: ObjectMap<string[]>;
}

/**
 * module types.
 */
export type Modules = Type<any> | ObjectMap<any>;

/**
 * load modules in base on an path
 */
export interface PathModules {
  /**
   * fire express base on the root path.
   *
   * @type {string}
   * @memberof LoadOptions
   */
  basePath?: string;
  /**
   * script files match express.
   * see: https://github.com/isaacs/node-glob
   *
   * @type {(string | string[])}
   * @memberof BuilderOptions
   */
  files?: string | string[];

  /**
   * modules
   *
   * @type {((Modules | string)[])}
   * @memberof AsyncLoadOptions
   */
  modules?: (Modules | string)[];
}

export interface Type<T> extends Function {
  new (...argsy: any[]): T;
  classAnnations?: ClassAnnations;
}

export interface AbstractType<T> extends Function {
  new?(...args: any[]): T;
  classAnnations?: ClassAnnations;
}

export type SymbolType<T> = Type<T> | AbstractType<T> | string | symbol;

export interface ObjectMap<T> {
  [index: string]: T;
}

export type Token<T> = Registration<T> | SymbolType<T>;

export type Providers = ObjectMap<any> | ProviderMap;

/**
 * load module type.
 */
export type LoadType = Modules | string | PathModules;

/**
 * to instance via container.
 */
export type ToInstance<T> = (
  container?: IContainer,
  ...providers: Providers[]
) => T;

/**
 * Factory of Token
 */
export type Factory<T> = T | Type<T> | ToInstance<T>;

/**
 * express.
 */
export interface Express<T, TResult> {
  (item: T): TResult;
}

/**
 * express
 */
export interface Express2<T1, T2, TResult> {
  (arg1: T1, arg2: T2): TResult;
}

/**
 * iterate way
 */
export enum Mode {
  /**
   * route up. iterate in parents.
   */
  route = 1,
  /**
   * iterate in children.
   */
  children,
  /**
   * iterate as tree map. node first
   */
  traverse,

  /**
   * iterate as tree map. node last
   */
  traverseLast,
}
