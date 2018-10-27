import { IModuleInjector } from './IModuleInjector';
import { IContainer } from '../IContainer';
import { Type } from '../types';

/**
 * module Injector chian interface.
 */
export interface IModuleInjectorChain {
  readonly injectors: IModuleInjector[];

  /**
   * set first step
   *
   * @param injector
   */
  first(injector: IModuleInjector): this;

  /**
   * set next step
   *
   * @param injector
   */
  next(injector: IModuleInjector): this;

  /**
   * inject module via injector chain
   *
   * @param container
   * @param modules
   */
  inject(container: IContainer, modules: Type<any>[]): Promise<Type<any>[]>;

  /**
   * syncInject(container: IContainer, modules: Type<any>[]): Type<any>[]
   *
   * @param container
   * @param modules
   */
  syncInject(container: IContainer, modules: Type<any>[]): Type<any>[];
}
