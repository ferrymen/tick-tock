import {
  IContainer,
  Token,
  LoadType,
  Factory,
  InjectToken,
} from '@ferrymen/fm-ioc-core';
import { AppConfigure } from './AppConfigure';
import {
  IModuleBuilder,
  ModuleConfig,
  ModuleEnv,
  InjectedModule,
  MdInstance,
} from '../modules';
import { IEvents, Events } from '../utils';

/**
 * custom define module.
 */
export type CustomRegister<T> = (
  container: IContainer,
  config?: AppConfigure,
  builder?: IApplicationBuilder<T>
) => Token<T>[] | Promise<Token<T>[]>;

/**
 * use module extends application.
 *
 */
export interface IApplicationExtends {
  /**
   * use custom configuration.
   *
   */
  useConfiguration(config?: string | AppConfigure): this;

  /**
   * use module
   *
   */
  use(...modules: LoadType[]): this;

  /**
   * bind provider
   *
   */
  provider(
    provide: Token<any>,
    provider: Token<any> | Factory<any>,
    beforRootInit?: boolean
  ): this;
}

/**
 * application builder.
 *
 */
export interface IApplicationBuilder<T>
  extends IModuleBuilder<T>,
    IApplicationExtends,
    IEvents {
  /**
   * events mgr.
   *
   */
  events?: Events;

  /**
   * get builder by token, config and env.
   *
   */
  getBuilderByConfig(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv
  ): Promise<IModuleBuilder<T>>;

  /**
   * get module builder
   *
   */
  getBuilder(injmdl: InjectedModule<T>): IModuleBuilder<T>;
}

export const ApplicationBuilderToken = new InjectToken<AnyApplicationBuilder>(
  'DI_AppBuilder'
);

/**
 * application builder. objected generics to any
 *
 */
export interface AnyApplicationBuilder extends IApplicationBuilder<any> {
  /**
   * build module as ioc container.
   *
   */
  build<T>(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv
  ): Promise<MdInstance<T>>;
}
