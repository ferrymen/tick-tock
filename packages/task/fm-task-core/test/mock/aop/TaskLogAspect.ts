import { Aspect, Around, Joinpoint, JoinpointState } from '@ferrymen/fm-aop';

import { Task } from '../../../src';

import { LoggerAspect } from '@ferrymen/fm-log';

import {
  ObjectMap,
  Inject,
  ContainerToken,
  IContainer,
} from '@ferrymen/fm-ioc-core';

import chalk from 'chalk';

import timestamp from 'time-stamp';
import prettyTime from 'pretty-hrtime';

/**
 * Task Log
 *
 */
@Aspect({
  annotation: Task,
  singleton: true,
})
export class TaskLogAspect extends LoggerAspect {
  private startHrts: ObjectMap<any>;
  constructor(@Inject(ContainerToken) container: IContainer) {
    super(container);

    this.startHrts = {};
  }

  @Around('execution(*.run)')
  logging(joinPoint: Joinpoint) {
    let logger = this.logger;
    let name = joinPoint.target.name;
    if (!name) {
      name = joinPoint.targetType.classAnnations
        ? joinPoint.targetType.classAnnations.name
        : joinPoint.targetType.name;
    }
    let start, end;
    let taskname = "'" + chalk.cyan(name) + "'";
    if (joinPoint.state === JoinpointState.Before) {
      start = process.hrtime();
      this.startHrts[name] = start;
      logger.log(
        '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
        'Starting',
        taskname,
        '...'
      );
    }

    if (joinPoint.state === JoinpointState.AfterReturning) {
      start = this.startHrts[name];
      end = prettyTime(process.hrtime(start));
      delete this.startHrts[name];
      logger.log(
        '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
        'Finished',
        taskname,
        ' after ',
        chalk.magenta(end)
      );
    }

    if (joinPoint.state === JoinpointState.AfterThrowing) {
      start = this.startHrts[name];
      end = prettyTime(process.hrtime(start));
      delete this.startHrts[name];
      logger.log(
        '[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']',
        'Finished',
        taskname,
        chalk.red('errored after'),
        chalk.magenta(end)
      );
      process.exit(1);
    }
  }
}
