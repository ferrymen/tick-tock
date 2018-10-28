import { IModuleLoader } from './injectors/IModuleLoader';
import { IContainer } from './IContainer';
import { LoadType, Modules, Type } from './types';
import { IModuleInjectorChain } from './injectors/IModuleInjectorChain';
import { InjectToken } from './InjectToken';

/**
 * ContainerBuilder interface token.
 * it is a token id, you can register yourself IContainerBuilder for this.
 */
export const ContainerBuilderToken = new InjectToken<IContainerBuilder>(
  'DI_IContainerBuilder'
);

export interface IContainerBuilder {
  readonly loader: IModuleLoader;

  /**
   * create a new container
   */
  create(): IContainer;

  /**
   * create a new container and load module via options
   * @param modules
   */
  build(...modules: LoadType[]): Promise<IContainer>;

  /**
   * build container in sync.
   *
   * @param modules
   */
  syncBuild(...modules: Modules[]): IContainer;

  /**
   * load modules for container
   *
   * @param container
   * @param modules
   */
  loadModule(
    container: IContainer,
    ...modules: LoadType[]
  ): Promise<Type<any>[]>;

  /**
   * sync load module
   *
   * @param container
   * @param modules
   */
  syncLoadModule(container: IContainer, ...modules: Modules[]): Type<any>[];

  /**
   * get moduleInjector chain
   *
   * @param container
   */
  getInjectorChain(container: IContainer): IModuleInjectorChain;
}
