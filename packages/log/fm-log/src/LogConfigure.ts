import { Token, InjectToken, ObjectMap } from '@ferrymen/fm-ioc-core';
import { ILoggerManager } from './ILoggerManager';
import { LOGFormater } from './LogFormater';

/**
 * Log configure interface symbol.
 * it is a symbol id, you can register yourself LogConfigure for this.
 */
export const LogConfigureToken = new InjectToken<LogConfigure>(
  'DI_LogConfigure'
);

/**
 * log configure. config logger format, looger adapter.
 *
 */
export interface LogConfigure {
  /**
   * log adapter
   *
   */
  adapter: Token<ILoggerManager>;

  /**
   * logger config options.
   *
   */
  config?: ObjectMap<any>;

  /**
   * format
   */
  format?: LOGFormater;
}
