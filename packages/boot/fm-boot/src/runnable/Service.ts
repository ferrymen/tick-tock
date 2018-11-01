import { ModuleConfigure } from '../modules';
import { Token, Registration } from '@ferrymen/fm-ioc-core';

/**
 * IService interface
 *
 */
export interface IService<T> {
  /**
   * start application service.
   *
   */
  start(data?: any): Promise<any>;
  /**
   * stop server.
   *
   */
  stop?(): Promise<any>;
}

/**
 * base service.
 *
 */
export abstract class Service<T> implements IService<T> {
  constructor(
    protected token?: Token<T>,
    protected instance?: T,
    protected config?: ModuleConfigure
  ) {}
  /**
   * start service.
   *
   */
  abstract start(data?: any): Promise<any>;
  /**
   * stop service.
   *
   */
  abstract stop(): Promise<any>;
}

/**
 * application service token.
 *
 */
export class InjectServiceToken<T> extends Registration<IService<T>> {
  constructor(type: Token<T>) {
    super(type, 'boot__service');
  }
}

/**
 * default service token.
 */
export const DefaultServiceToken = new InjectServiceToken<any>('default');
