import {
  IContainer,
  Type,
  isClass,
  Registration,
  Abstract,
} from '@ferrymen/fm-ioc-core';

import { Joinpoint, JoinpointState } from '@ferrymen/fm-aop';

import { isFunction, isObject, isString } from 'util';
import { ILogger } from './ILogger';
import {
  IConfigureLoggerManager,
  ConfigureLoggerManagerToken,
} from './IConfigureLoggerManager';

import { LoggerMetadata } from './decorators';
import { Level } from './Level';
import { ILogFormater, LogFormaterToken } from './LogFormater';
import { LogConfigure } from './LogConfigure';

/**
 * base looger aspect. for extends your logger aspect.
 *
 */
@Abstract()
export class LoggerAspect {
  private _logger: ILogger;
  private _logManger: IConfigureLoggerManager;

  constructor(
    protected container: IContainer,
    private config?: LogConfigure | Type<LogConfigure>
  ) {}

  get logger(): ILogger {
    if (!this._logger) {
      this._logger = this.logManger.getLogger();
    }
    return this._logger;
  }

  get logManger(): IConfigureLoggerManager {
    if (!this._logManger) {
      this._logManger = this.container.resolve(ConfigureLoggerManagerToken, {
        config: this.config,
      });
    }
    return this._logManger;
  }

  protected processLog(
    joinPoint: Joinpoint,
    annotation?: LoggerMetadata[],
    message?: string,
    level?: Level
  ) {
    if (annotation && annotation.length) {
      annotation.forEach(logmeta => {
        let canlog = false;
        if (logmeta.express && logmeta.express(joinPoint)) {
          canlog = true;
        } else if (!logmeta.express) {
          canlog = true;
        }
        if (canlog) {
          this.writeLog(
            logmeta.logname
              ? this.logManger.getLogger(logmeta.logname)
              : this.logger,
            joinPoint,
            this.joinMessage(message, logmeta.message),
            logmeta.level || level
          );
        }
      });
    } else {
      this.writeLog(this.logger, joinPoint, message, level);
    }
  }

  protected formatMessage(joinPoint: Joinpoint, message?: string) {
    let config = this.logManger.config;
    if (isClass(config.format)) {
      if (!this.container.has(config.format)) {
        this.container.register(config.format);
      }
      return this.container
        .resolve<ILogFormater>(config.format)
        .format(joinPoint, message);
    } else if (isFunction(config.format)) {
      return (config as any).format(joinPoint, message);
    } else if (isObject(config.format) && isFunction(config.format)) {
      return (config.format as any).format(joinPoint, message);
    } else {
      let token = isString(config.format) ? config.format : '';
      let foramter = this.container.resolve<ILogFormater>(
        new Registration(LogFormaterToken, token || 'default')
      );
      if (foramter) {
        return foramter.format(joinPoint, message);
      }
    }

    return '';
  }

  protected joinMessage(...messgs: any[]) {
    return messgs
      .filter(a => a)
      .map(a => (isString(a) ? a : a.toString()))
      .join('; ');
  }

  protected writeLog(
    logger: ILogger,
    joinPoint: Joinpoint,
    message?: string,
    level?: Level
  ) {
    let formatStr = this.formatMessage(joinPoint, message);

    if (level) {
      logger[level](formatStr);
    } else {
      switch (joinPoint.state) {
        case JoinpointState.Before:
        case JoinpointState.After:
        case JoinpointState.AfterReturning:
          logger.debug(formatStr);
          break;
        case JoinpointState.Pointcut:
          logger.info(formatStr);
          break;

        case JoinpointState.AfterThrowing:
          logger.error(formatStr);
          break;
      }
    }
  }
}
