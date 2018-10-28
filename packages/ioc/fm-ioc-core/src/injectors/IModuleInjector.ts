import { IContainer } from '../IContainer';
import { Type } from '../types';
import { Registration } from '../Registration';

/**
 *  InjectorResult
 *
 */
export interface InjectorResult {
  injected: Type<any>[];
  next?: Type<any>[];
}

/**
 *  inject module injector token.
 */
export class InjectModuleInjectorToken<
  T extends IModuleInjector
> extends Registration<T> {
  constructor(desc: string, sync = false) {
    super(sync ? 'DI_SyncModuleInjector' : 'DI_ModuleInjector', desc);
  }
}

/**
 * async module injector token.
 */
export const ModuleInjectorToken = new InjectModuleInjectorToken<
  IModuleInjector
>('');

/**
 * Sync module injector token.
 */
export const SyncModuleInjectorToken = new InjectModuleInjectorToken<
  IModuleInjector
>('', true);

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
