import { Registration, Token, IContainer } from '@ferrymen/fm-ioc-core';

import { InjectedModule } from './InjectedModule';
import { ContainerPool } from '../utils';
import { ModuleConfig } from './ModuleConfigure';
import { MdInstance } from './ModuleType';
import { Runnable } from '../runnable';

const moduleBuilderDesc = 'DI_ModuleBuilder';

/**
 * inject module builder token.
 *
 */
export class InjectModuleBuilderToken<T> extends Registration<
  IModuleBuilder<T>
> {
  constructor(type: Token<T>) {
    super(type, moduleBuilderDesc);
  }
}

/**
 * load default container or, loaded module.
 */
export type ModuleEnv = IContainer | InjectedModule<any>;

/**
 * Generics module builder insterface.
 *
 */
export interface IModuleBuilder<T> {
  /**
   * get container pool
   *
   */
  getPools(): ContainerPool;

  /**
   * import module.
   *
   */
  import(module: Token<T>, parent?: IContainer): Promise<InjectedModule<T>>;

  /**
   * build module as ioc container.
   *
   */
  build(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv,
    data?: any
  ): Promise<T>;

  /**
   * bootstrap module's main.
   *
   */
  bootstrap(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv,
    data?: any
  ): Promise<Runnable<T>>;

  /**
   * run module.
   *
   */
  run(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv,
    data?: any
  ): Promise<Runnable<T>>;
}

/**
 * default module builder token.
 */
export const DefaultModuleBuilderToken = new InjectModuleBuilderToken<any>(
  Object
);

/**
 * module builder token.
 */
export const ModuleBuilderToken = new Registration<AnyModuleBuilder>(
  'any',
  moduleBuilderDesc
);

/**
 *  module builder. objected generics to any
 *
 */
export interface AnyModuleBuilder extends IModuleBuilder<any> {
  /**
   * build module as ioc container.
   *
   */
  build<T>(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv,
    data?: any
  ): Promise<MdInstance<T>>;
}
