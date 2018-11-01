import { InjectToken, Type } from '@ferrymen/fm-ioc-core';
import { ILoggerManager } from './ILoggerManager';
import { LogConfigure } from './LogConfigure';

/**
 * IConfigureLoggerManager interface token.
 * it is a token id, you can register yourself IConfigureLoggerManager for this.
 */
export const ConfigureLoggerManagerToken = new InjectToken<
  IConfigureLoggerManager
>('DI_IConfigureLoggerManager');

/**
 * Configure logger manger. use to get configed logger manger.
 *
 */
export interface IConfigureLoggerManager extends ILoggerManager {
  /**
   * readonly config.
   *
   */
  readonly config: LogConfigure;

  /**
   * set log configure.
   *
   */
  setLogConfigure(config: LogConfigure | Type<LogConfigure>);
}
