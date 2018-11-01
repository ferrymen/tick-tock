import {
  TypeMetadata,
  Express,
  IClassMethodDecorator,
  ClassMethodDecorator,
  createClassMethodDecorator,
  isClassMetadata,
} from '@ferrymen/fm-ioc-core';

import { isString, isFunction } from 'util';
import { Level } from '../Level';

export interface LoggerMetadata extends TypeMetadata {
  /**
   * set the special name to get logger from logger manager.
   *
   */
  logname?: string;

  /**
   * log level
   */
  level?: Level;

  /**
   * only match express condition can do loging.
   */
  express?: Express<any, boolean>;
  /**
   * set special message to logging
   *
   */
  message?: string;
}

/**
 * Logger decorator, for method or class.
 *
 * @Logger
 *
 */
export interface ILoggerDecorator<T extends LoggerMetadata>
  extends IClassMethodDecorator<T> {
  /**
   * define logger annotation pointcut to this class or method.
   * @Logger
   *
   */
  (
    logname?: string,
    express?: Express<any, boolean>,
    message?: string,
    level?: Level
  ): ClassMethodDecorator;
}

/**
 * Logger decorator, for method or class.
 *
 * @Logger
 */
export const Logger: ILoggerDecorator<
  LoggerMetadata
> = createClassMethodDecorator<TypeMetadata>('Logger', adapter => {
  adapter.next<LoggerMetadata>({
    isMetadata: arg => isClassMetadata(arg, ['logname']),
    match: arg => isString(arg),
    setMetadata: (metadata, arg) => {
      metadata.logname = arg;
    },
  });
  adapter.next<LoggerMetadata>({
    match: arg => isFunction(arg),
    setMetadata: (metadata, arg) => {
      metadata.express = arg;
    },
  });
  adapter.next<LoggerMetadata>({
    match: arg => isString(arg),
    setMetadata: (metadata, arg) => {
      metadata.message = arg;
    },
  });

  adapter.next<LoggerMetadata>({
    match: arg => isString(arg),
    setMetadata: (metadata, arg: string) => {
      metadata.level = Level[arg];
    },
  });
}) as ILoggerDecorator<LoggerMetadata>;
