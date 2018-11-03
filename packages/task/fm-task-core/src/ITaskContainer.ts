import { InjectToken, Type } from '@ferrymen/fm-ioc-core';

import { IApplicationExtends, IApplicationBuilder } from '@ferrymen/fm-boot';
import { IActivityRunner, Active } from './core';

/**
 * TaskContainer token.
 */
export const TaskContainerToken = new InjectToken<ITaskContainer>(
  '__TASK_TaskContainer'
);

/**
 * task container.
 *
 */
export interface ITaskContainer extends IApplicationExtends {
  useLog(logAspect: Type<any>): this;

  getBuilder(): IApplicationBuilder<any>;

  /**
   * get workflow.
   *
   */
  getWorkflow<T>(workflowId: string): IActivityRunner<T>;

  /**
   * create workflow by activity.
   *
   */
  createActivity(
    activity: Active,
    workflowId?: string
  ): Promise<IActivityRunner<any>>;

  /**
   * create workflow, run it.
   *
   */
  run(...activities: Active[]): Promise<IActivityRunner<any>>;

  /**
   * create workflow and bootstrap.
   *
   */
  bootstrap(...activities: Active[]): Promise<IActivityRunner<any>>;
}
