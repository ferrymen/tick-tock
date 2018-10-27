import { IContainer } from '../IContainer';
import { Type } from '../types';

/**
 * module injector
 */
export interface IModuleInjector {
  /**
   * inject module to container
   *
   * @param container
   * @param modules
   */
  inject(container: IContainer, modules: Type<any>[]): any;
}
