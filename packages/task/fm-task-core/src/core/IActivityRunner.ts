import { InjectServiceToken, IService } from '@ferrymen/fm-boot';
import { IActivity, GActivity } from './IActivity';
import { Activity } from './Activity';
import { Token } from '@ferrymen/fm-ioc-core';
import { ActivityConfigure } from './ActivityConfigure';
import { Observable } from 'rxjs';
import { Joinpoint } from '@ferrymen/fm-aop';

/**
 * activity runner token.
 */
export const ActivityRunnerToken = new InjectServiceToken<IActivity>(Activity);

/**
 *run state.
 *
 */
export enum RunState {
  /**
   * activity init.
   */
  init,
  /**
   * runing.
   */
  running,
  /**
   * activity parused.
   */
  pause,
  /**
   * activity stopped.
   */
  stop,
  /**
   * activity complete.
   */
  complete,
}

/**
 * task runner.
 *
 */
export interface IActivityRunner<T> extends IService<GActivity<T>> {
  /**
   * actvity to run.
   *
   */
  readonly activity: Token<IActivity>;

  readonly configure: ActivityConfigure;

  /**
   * activity instance
   *
   */
  readonly instance: GActivity<T>;

  /**
   * current run task data.
   *
   */
  readonly state: RunState;

  /**
   * run result, observable data.
   *
   */
  readonly result: Observable<any>;

  /**
   * run result value
   *
   */
  readonly resultValue: any;

  /**
   *state changed.
   *
   */
  readonly stateChanged: Observable<RunState>;

  /**
   * start activity.
   *
   */
  start(data?: any): Promise<T>;

  /**
   * stop running activity.
   *
   */
  stop(): Promise<any>;

  /**
   * pause running activity.
   *
   */
  pause(): Promise<any>;

  /**
   * save state.
   *
   */
  saveState(state: Joinpoint);
}
