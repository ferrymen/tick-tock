/**
 * logger interface
 *
 */
export interface ILogger {
  /**
   * logger level
   *
   */
  level: string;

  /**
   * log, base log.
   *
   */
  log(message: any, ...args: any[]): void;

  /**
   * trace log.
   *
   */
  trace(message: any, ...args: any[]): void;

  /**
   * debg log.
   *
   */
  debug(message: any, ...args: any[]): void;

  /**
   * info log.
   *
   */
  info(message: any, ...args: any[]): void;

  /**
   * warn log.
   *
   */
  warn(message: any, ...args: any[]): void;

  /**
   * error log.
   *
   */
  error(message: any, ...args: any[]): void;

  /**
   * fatal error log.
   *
   */
  fatal(message: any, ...args: any[]): void;
}
