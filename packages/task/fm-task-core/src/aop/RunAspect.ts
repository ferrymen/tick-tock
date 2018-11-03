import { Aspect, Before, Joinpoint } from '@ferrymen/fm-aop';
import { Inject, ContainerToken, IContainer } from '@ferrymen/fm-ioc-core';
import { Task } from '../decorators';
import { RunState, Activity, IActivityRunner } from '../core';

/**
 * Task Log
 *
 */
@Aspect({
  annotation: Task,
  singleton: true,
})
export class RunAspect {
  /**
   * ioc container.
   *
   */
  @Inject(ContainerToken)
  container: IContainer;

  constructor() {}

  @Before('execution(*.run)')
  beforeRun(joinPoint: Joinpoint) {
    let runner = this.getRunner(joinPoint.target);
    if (!runner) {
      return;
    }
    runner.saveState(joinPoint);
    switch (runner.state) {
      case RunState.pause:
        throw new Error('workflow paused!');
      case RunState.stop:
        throw new Error('workflow stop!');
    }
  }

  // @AfterReturning('execution(*.run)')
  // afterRun(joinPoint: Joinpoint) {
  //   let runner = this.getRunner(joinPoint.target);
  //   if (!runner) {
  //     return;
  //   }
  //   runner.saveState(joinPoint);
  //   switch (runner.state) {
  //     case RunState.pause:
  //       throw new Error('workflow paused!');
  //     case RunState.stop:
  //       throw new Error('workflow stop!');
  //   }
  // }

  getRunner(task: any) {
    if (task instanceof Activity) {
      if (task.id && this.container.has(task.id)) {
        return this.container.resolve<IActivityRunner<any>>(task.id);
      }
    }
    return null;
  }
}
