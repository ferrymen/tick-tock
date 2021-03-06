import {
  LoadType,
  MapSet,
  Token,
  IContainerBuilder,
  DefaultContainerBuilder,
  IContainer,
  Factory,
  isClass,
  isToken,
  isUndefined,
  isString,
  Lang,
} from '@ferrymen/fm-ioc-core';
import {
  IApplicationBuilder,
  CustomRegister,
  AnyApplicationBuilder,
} from './IApplicationBuilder';
import {
  AppConfigure,
  AppConfigureLoaderToken,
  AppConfigureToken,
  DefaultConfigureToken,
} from './AppConfigure';
import { IEvents, Events, ContainerPool, ContainerPoolToken } from '../utils';
import {
  ModuleEnv,
  InjectedModule,
  ModuleConfig,
  IModuleBuilder,
  InjectModuleBuilderToken,
  DefaultModuleBuilderToken,
  ModuleBuilderToken,
  ModuleBuilder,
  DIModuleInjectorToken,
} from '../modules';
import { Runnable } from '../runnable';
import { BootModule } from '../BootModule';

/**
 * application events
 *
 */
export enum AppEvents {
  onRootContainerCreated = 'onRootContainerCreated',
  onRootContainerInited = 'onRootContainerInited',
  onModuleCreated = 'onModuleCreated',
  onBootCreated = 'onBootCreated',
  onRunnableStarted = 'onRunnableStarted',
}

/**
 * application events
 */
export const ApplicationEvents = AppEvents;

/**
 * application builder.
 *
 */
export class DefaultApplicationBuilder<T> extends ModuleBuilder<T>
  implements IApplicationBuilder<T>, IEvents {
  private globalConfig: AppConfigure;
  protected globalModules: LoadType[];
  protected customRegs: CustomRegister<T>[];
  protected beforeInitPds: MapSet<Token<any>, any>;
  protected afterInitPds: MapSet<Token<any>, any>;
  protected configs: (string | AppConfigure)[];
  inited = false;

  events: Events;

  constructor(public baseURL?: string) {
    super();
    this.customRegs = [];
    this.globalModules = [];
    this.configs = [];
    this.beforeInitPds = new MapSet();
    this.afterInitPds = new MapSet();
    this.events = new Events();
    this.initEvents();
  }

  protected initEvents() {
    this.events.on(AppEvents.onRootContainerInited, container => {
      this.afterInitPds.forEach((val, key) => {
        container.bindProvider(key, val);
      });
    });
  }

  static create(baseURL?: string): AnyApplicationBuilder {
    return new DefaultApplicationBuilder<any>(baseURL);
  }

  on(name: string, event: (...args: any[]) => void): this {
    this.events.on(name, event);
    return this;
  }
  off(name: string, event?: (...args: any[]) => void): this {
    this.events.off(name, event);
    return this;
  }
  emit(name: string, ...args: any[]): void {
    this.events.emit(name, ...args);
  }

  getPools(): ContainerPool {
    if (!this.pools) {
      this.pools = new ContainerPool(this.createContainerBuilder());
      this.createDefaultContainer();
    }
    return this.pools;
  }

  protected createContainerBuilder(): IContainerBuilder {
    return new DefaultContainerBuilder();
  }

  /**
   * use configuration.
   *
   */
  useConfiguration(config?: string | AppConfigure): this {
    if (isUndefined(config)) {
      config = '';
    }
    // clean cached config.
    this.globalConfig = null;
    let idx = this.configs.indexOf(config);
    if (idx >= 0) {
      this.configs.splice(idx, 1);
    }
    this.configs.push(config);

    return this;
  }

  protected loadConfig(
    container: IContainer,
    src: string
  ): Promise<AppConfigure> {
    if (container.has(AppConfigureLoaderToken)) {
      let loader = container.resolve(AppConfigureLoaderToken, {
        baseURL: this.baseURL,
        container: container,
      });
      return loader.load(src);
    } else if (src) {
      let builder = container.getBuilder();
      return builder.loader.load([src]).then(rs => {
        return rs.length ? (rs[0] as AppConfigure) : null;
      });
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * use module as global Depdences module.
   *
   */
  use(...modules: LoadType[]): this {
    this.globalModules = this.globalModules.concat(modules);
    this.inited = false;
    return this;
  }

  /**
   * bind provider
   *
   */
  provider(
    provide: Token<any>,
    provider: Token<any> | Factory<any>,
    beforRootInit?: boolean
  ): this {
    if (beforRootInit) {
      this.beforeInitPds.set(provide, provider);
    } else {
      this.afterInitPds.set(provide, provider);
    }
    return this;
  }

  protected async load(
    token: Token<T> | AppConfigure,
    env?: ModuleEnv
  ): Promise<InjectedModule<T>> {
    await this.initRootContainer();
    return super.load(token, env);
  }

  async build(
    token: Token<T> | AppConfigure,
    env?: ModuleEnv,
    data?: any
  ): Promise<T> {
    let injmdl = await this.load(token, env);
    let builder = this.getBuilder(injmdl);
    let md = await builder.build(token, injmdl, data);
    this.emit(AppEvents.onModuleCreated, md, token);
    return md;
  }

  async bootstrap(
    token: Token<T> | AppConfigure,
    env?: ModuleEnv,
    data?: any
  ): Promise<Runnable<T>> {
    let injmdl = await this.load(token, env);
    let builder = this.getBuilder(injmdl);
    return await builder.bootstrap(token, injmdl, data);
  }

  run(
    token: Token<T> | AppConfigure,
    env?: ModuleEnv,
    data?: any
  ): Promise<Runnable<T>> {
    return this.bootstrap(token, env, data);
  }

  /**
   * get module builder
   *
   */
  async getBuilderByConfig(
    token: Token<T> | ModuleConfig<T>,
    env?: ModuleEnv
  ): Promise<IModuleBuilder<T>> {
    let injmdl = await this.load(token, env);
    return this.getBuilder(injmdl);
  }

  getBuilder(injmdl: InjectedModule<T>): IModuleBuilder<T> {
    let cfg = injmdl.config;
    let container = injmdl.container;
    let builder: IModuleBuilder<T>;
    if (cfg) {
      if (isClass(cfg.builder)) {
        if (!container.has(cfg.builder)) {
          container.register(cfg.builder);
        }
      }
      if (isToken(cfg.builder)) {
        builder = container.resolve(cfg.builder);
      } else if (cfg.builder instanceof ModuleBuilder) {
        builder = cfg.builder;
      }
    }

    let tko = injmdl.token;
    if (!builder && tko) {
      builder = container.getRefService(
        InjectModuleBuilderToken,
        tko,
        DefaultModuleBuilderToken
      );
    }
    if (!builder) {
      builder = this.getDefaultBuilder(container);
    }

    return builder || this;
  }

  protected async autoRun(
    container: IContainer,
    token: Token<any>,
    cfg: ModuleConfig<T>,
    instance: any,
    data?: any
  ): Promise<Runnable<T>> {
    this.emit(AppEvents.onBootCreated, instance, token);
    let runnable = await super.autoRun(container, token, cfg, instance, data);
    this.emit(AppEvents.onRunnableStarted, runnable, instance, token);
    return runnable;
  }

  protected getDefaultBuilder(container: IContainer): IModuleBuilder<any> {
    return container.resolve(ModuleBuilderToken);
  }

  protected async getGlobalConfig(
    container: IContainer
  ): Promise<AppConfigure> {
    if (!this.globalConfig) {
      let globCfg = await this.getDefaultConfig(container);
      if (this.configs.length < 1) {
        this.configs.push(''); // load default loader config.
      }
      let exts = await Promise.all(
        this.configs.map(cfg => {
          if (isString(cfg)) {
            return this.loadConfig(container, cfg);
          } else {
            return cfg;
          }
        })
      );
      exts.forEach(exCfg => {
        if (exCfg) {
          Lang.assign(globCfg, exCfg);
        }
      });
      this.globalConfig = globCfg;
    }
    return this.globalConfig;
  }

  protected createDefaultContainer() {
    let container = this.pools.getDefault();
    container.register(BootModule);

    let chain = container.getBuilder().getInjectorChain(container);
    chain.first(container.resolve(DIModuleInjectorToken));
    container.bindProvider(ContainerPoolToken, () => this.getPools());

    this.beforeInitPds.forEach((val, key) => {
      container.bindProvider(key, val);
    });

    this.events.emit(AppEvents.onRootContainerCreated, container);
    return container;
  }

  protected async initRootContainer(container?: IContainer) {
    if (this.inited) {
      return;
    }
    container = container || this.getPools().getDefault();
    let globCfg = await this.getGlobalConfig(container);
    await this.registerExts(container, globCfg);
    this.bindAppConfig(globCfg);
    container.bindProvider(AppConfigureToken, globCfg);
    this.inited = true;
    this.events.emit(AppEvents.onRootContainerInited, container);
  }

  /**
   * register ioc exts
   *
   */
  protected async registerExts(
    container: IContainer,
    config: AppConfigure
  ): Promise<IContainer> {
    if (this.globalModules.length) {
      let usedModules = this.globalModules;
      await container.loadModule(...usedModules);
    }

    if (this.customRegs.length) {
      await Promise.all(
        this.customRegs.map(async cs => {
          let tokens = await cs(container, config, this);
          return tokens;
        })
      );
    }

    return container;
  }

  protected bindAppConfig(config: AppConfigure): AppConfigure {
    if (this.baseURL) {
      config.baseURL = this.baseURL;
    }
    return config;
  }

  protected async getDefaultConfig(
    container: IContainer
  ): Promise<AppConfigure> {
    if (container.has(DefaultConfigureToken)) {
      return container.resolve(DefaultConfigureToken);
    } else {
      return {} as AppConfigure;
    }
  }
}
