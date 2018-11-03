import {
  Activity,
  IActivity,
  ActivityType,
  ActivityConfigure,
  ActivityRunnerToken,
  UUIDToken,
  RandomUUIDFactory,
} from '../core';
import {
  InjectModuleBuilderToken,
  ModuleBuilder,
  ModuleEnv,
  Runnable,
  IService,
} from '@ferrymen/fm-boot';
import { Singleton, IContainer, Providers, Token } from '@ferrymen/fm-ioc-core';

/**
 * workflow builder token.
 */
export const WorkflowBuilderToken = new InjectModuleBuilderToken<IActivity>(
  Activity
);
/**
 * default Workflow Builder.
 *
 */
@Singleton(WorkflowBuilderToken)
export class DefaultWorkflowBuilder extends ModuleBuilder<IActivity> {
  /**
   * bootstrap workflow via activity.
   *
   */
  async bootstrap(
    activity: ActivityType<IActivity>,
    env?: ModuleEnv,
    workflowId?: string
  ): Promise<Runnable<IActivity>> {
    let injmdl = await this.load(activity, env);
    workflowId = workflowId || this.createUUID(injmdl.container);
    let runner = await super.bootstrap(activity, injmdl, workflowId);
    return runner;
  }

  protected createUUID(container: IContainer) {
    if (!container.has(UUIDToken)) {
      container.register(RandomUUIDFactory);
    }
    return container.get(UUIDToken).generate();
  }

  protected getBootType(config: ActivityConfigure): Token<any> {
    return config.activity || config.task || super.getBootType(config);
  }

  protected getDefaultService(
    container: IContainer,
    ...providers: Providers[]
  ): IService<IActivity> {
    return container.resolve(ActivityRunnerToken, ...providers);
  }
}
