import { LoadType, Modules, Type } from '../types';
import { InjectToken } from '../InjectToken';

/**
 * module loader token.
 */
export const ModuleLoaderToken = new InjectToken<IModuleLoader>(
  'DI_ModuleLoader'
);

export interface IModuleLoader {
  /**
   * load modules by files patterns, module name or modules
   *
   * @param modules
   */
  load(modules: LoadType[]): Promise<Modules[]>;

  /**
   * load all class types in modules
   * @param modules
   */
  loadTypes(modules: LoadType[]): Promise<Type<any>[][]>;

  /**
   * get all class type in modules
   *
   * @param modules
   */
  getTypes(modules: Modules[]): Type<any>[][];
}
