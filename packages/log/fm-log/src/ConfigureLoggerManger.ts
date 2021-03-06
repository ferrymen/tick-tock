import { NonePointcut } from '@ferrymen/fm-aop';

import {
  Injectable,
  Inject,
  ContainerToken,
  IContainer,
  Type,
  isClass,
  Token,
  Registration,
} from '@ferrymen/fm-ioc-core';

import { isString } from 'util';
import {
  ConfigureLoggerManagerToken,
  IConfigureLoggerManager,
} from './IConfigureLoggerManager';
import { LogConfigure, LogConfigureToken } from './LogConfigure';
import { ILoggerManager, LoggerManagerToken } from './ILoggerManager';
import { ILogger } from './ILogger';

/**
 * Configure logger manger. use to get configed logger manger.
 *
 */
@NonePointcut()
@Injectable(ConfigureLoggerManagerToken)
export class ConfigureLoggerManger implements IConfigureLoggerManager {
  private _config: LogConfigure;
  private _logManger: ILoggerManager;

  constructor(
    @Inject(ContainerToken) protected container: IContainer,
    config?: LogConfigure | Type<LogConfigure>
  ) {
    this.setLogConfigure(config);
  }

  get config(): LogConfigure {
    if (!this._config) {
      if (this.container.has(LogConfigureToken)) {
        this._config = this.container.resolve(LogConfigureToken);
      } else {
        this._config = { adapter: 'console' };
      }
    }
    return this._config;
  }

  setLogConfigure(config: LogConfigure | Type<LogConfigure>) {
    if (!config) {
      return;
    }
    if (isClass(config)) {
      if (!this.container.has(LogConfigureToken)) {
        this.container.register(LogConfigureToken, config);
        this._config = this.container.get(LogConfigureToken);
      } else if (!this.container.has(config)) {
        this.container.register(config);
        this._config = this.container.get<LogConfigure>(config);
      }
    } else {
      this._config = config;
    }
    this._logManger = null;
  }

  protected get logManger(): ILoggerManager {
    if (!this._logManger) {
      let cfg: LogConfigure = this.config || <LogConfigure>{};
      let adapter = cfg.adapter || 'console';
      let token: Token<any>;
      if (isString(adapter)) {
        token = new Registration(LoggerManagerToken, adapter);
      } else {
        token = adapter;
      }
      this._logManger = this.container.get<ILoggerManager>(token);
      if (cfg.config) {
        this._logManger.configure(cfg.config);
      }
    }
    return this._logManger;
  }

  configure(config: any) {
    this.logManger.configure(config);
  }

  getLogger(name?: string): ILogger {
    return this.logManger.getLogger(name);
  }
}
