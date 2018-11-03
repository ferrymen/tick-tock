import {
  InjectModuleInjectorToken,
  Injectable,
  Inject,
  IContainer,
  IModuleValidate,
  Type,
} from '@ferrymen/fm-ioc-core';
import {
  DIModuleInjector,
  InjectedModule,
  InjectedModuleToken,
} from '@ferrymen/fm-boot';
import { WorkflowModuleValidateToken } from './WorkflowModuleValidate';
import { Workflow } from '../decorators';

/**
 * workflow module injector token.
 */
export const WorkflowModuleInjectorToken = new InjectModuleInjectorToken(
  Workflow.toString()
);
/**
 * workflow module injector
 *
 */
@Injectable(WorkflowModuleInjectorToken)
export class WorkflowModuleInjector extends DIModuleInjector {
  constructor(@Inject(WorkflowModuleValidateToken) validate: IModuleValidate) {
    super(validate);
  }

  protected async importModule(
    container: IContainer,
    type: Type<any>
  ): Promise<InjectedModule<any>> {
    container.register(type);
    let metaConfig = this.validate.getMetaConfig(type, container);
    await this.registerConfgureDepds(container, metaConfig);

    let injMd = new InjectedModule(type, metaConfig, container);
    container.bindProvider(new InjectedModuleToken(type), injMd);

    return injMd;
  }
}
