import path from 'path';
import timestamp from 'time-stamp';
import {
  ITaskContainer,
  DefaultTaskContainer,
  Active,
  IActivityRunner,
} from 'task/fm-task-core/src';
import { IApplicationBuilder } from '@ferrymen/fm-boot';
import { LoadType } from '@ferrymen/fm-ioc-core';
import chalk from 'chalk';
import { TaskLogAspect, RunnerLogAspect } from './aop';

const processRoot = path.join(
  path.dirname(process.cwd()),
  path.basename(process.cwd())
);
/**
 * task container in server.
 *
 */
export class TaskContainer extends DefaultTaskContainer
  implements ITaskContainer {
  constructor(baseURL?: string) {
    super(baseURL);
    this.use(TaskLogAspect).use(RunnerLogAspect);
  }

  protected createAppBuilder(): IApplicationBuilder<any> {
    return new ApplicationBuilder(this.baseURL || processRoot);
  }

  /**
   * create task container.
   *
   */
  static create(root?: string, ...modules: LoadType[]) {
    let taskContainer = new TaskContainer(root);
    if (modules) {
      taskContainer.use(...modules);
    }
    return taskContainer;
  }

  async createActivity(
    activity: Active,
    workflowId?: string
  ): Promise<IActivityRunner<any>> {
    console.log(
      '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
      'Loading  workflow ',
      workflowId || '',
      '...'
    );
    return super.createActivity(activity, workflowId);
  }
}
