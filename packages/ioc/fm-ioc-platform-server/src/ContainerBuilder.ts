import { IModuleLoader, DefaultContainerBuilder } from '@ferrymen/fm-ioc-core';
import { NodeModuleLoader } from './NodeModuleLoader';

/**
 * container builder.
 *
 */
export class ContainerBuilder extends DefaultContainerBuilder {
  constructor(loader?: IModuleLoader) {
    super(loader || new NodeModuleLoader());
  }
}
