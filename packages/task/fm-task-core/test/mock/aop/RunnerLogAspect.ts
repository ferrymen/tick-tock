import { Aspect, Around, Joinpoint, JoinpointState } from '@ferrymen/fm-aop';
import { LoggerAspect } from '@ferrymen/fm-log';
import {
  ObjectMap,
  Inject,
  ContainerToken,
  IContainer,
} from '@ferrymen/fm-ioc-core';
import { IActivityRunner, ActivityRunner } from 'task/fm-task-core/src';
import chalk from 'chalk';
import timestamp from 'time-stamp';
import prettyTime from 'pretty-hrtime';

/**
 * Task Log
 *
 */
@Aspect({
  // annotation: Workflow,
  within: ActivityRunner,
  singleton: true,
})
export class RunnerLogAspect extends LoggerAspect {
  private startHrts: ObjectMap<any>;
  constructor(@Inject(ContainerToken) container: IContainer) {
    super(container);

    this.startHrts = {};
  }

  @Around('execution(*.start)')
  logStart(joinPoint: Joinpoint) {
    let logger = this.logger;
    let runner = joinPoint.target as IActivityRunner<any>;
    let uuid = runner.instance.id;
    let name = runner.instance.name;
    let start, end;
    let taskname = "'" + chalk.cyan(name) + "'";
    if (joinPoint.state === JoinpointState.Before) {
      start = process.hrtime();
      this.startHrts[uuid] = start;
      logger.log(
        '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
        'Starting workflow',
        taskname,
        '...'
      );
    }

    if (joinPoint.state === JoinpointState.AfterReturning) {
      start = this.startHrts[uuid];
      end = prettyTime(process.hrtime(start));
      delete this.startHrts[uuid];
      logger.log(
        '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
        'Finished workflow',
        taskname,
        ' after ',
        chalk.magenta(end)
      );
    }

    if (joinPoint.state === JoinpointState.AfterThrowing) {
      start = this.startHrts[uuid];
      end = prettyTime(process.hrtime(start));
      delete this.startHrts[uuid];
      logger.log(
        '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
        'Finished workflow',
        taskname,
        chalk.red('errored after'),
        chalk.magenta(end)
      );
      process.exit(1);
    }
  }
}
