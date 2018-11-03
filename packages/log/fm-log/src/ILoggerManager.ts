import { ObjectMap, InjectToken } from '@ferrymen/fm-ioc-core';

import { ILogger } from '.';

/**
 * logger configuation.
 *
 * @export
 * @interface LoggerConfig
 * @extends {ObjectMap<any>}
 */
export interface LoggerConfig extends ObjectMap<any> {}

/**
 * LoggerManger interface token.
 * it is a token id, you can register yourself LoggerManger for this.
 */
export const LoggerManagerToken = new InjectToken<ILoggerManager>(
  'DI_ILoggerManager'
);
/**
 * logger manager.
 *
 */
export interface ILoggerManager {
  /**
   * config logger context.
   *
   */
  configure(config: LoggerConfig): void;
  /**
   * get logger.
   *
   */
  getLogger(name?: string): ILogger;
}
