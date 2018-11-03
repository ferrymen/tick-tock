import {
  Injectable,
  Token,
  Inject,
  ContainerToken,
  IContainer,
} from '@ferrymen/fm-ioc-core';
import {
  ActivityRunnerToken,
  IActivityRunner,
  RunState,
} from './IActivityRunner';
import { BehaviorSubject, Observable } from 'rxjs';
import { Joinpoint } from '@ferrymen/fm-aop';
import { IActivity } from './IActivity';
import { ActivityConfigure } from './ActivityConfigure';
import { ActivityContext } from './ActivityContext';
import { filter } from 'rxjs/operators';

/**
 * task runner.
 *
 */
@Injectable(ActivityRunnerToken)
export class ActivityRunner<T> implements IActivityRunner<T> {
  get activity(): Token<IActivity> {
    return this.token;
  }
  get configure(): ActivityConfigure {
    return this.config;
  }

  private _result = new BehaviorSubject<any>(null);
  get result(): Observable<any> {
    return this._result.pipe(filter(a => !a));
  }

  private _resultValue: any;
  get resultValue(): any {
    return this._resultValue;
  }

  state: RunState;
  stateChanged: BehaviorSubject<RunState>;

  @Inject(ContainerToken)
  container: IContainer;

  constructor(
    public token: Token<IActivity>,
    public config: ActivityConfigure,
    public instance: IActivity
  ) {
    this.stateChanged = new BehaviorSubject(RunState.init);
  }

  async start(data?: any): Promise<T> {
    let ctx =
      data instanceof ActivityContext
        ? data
        : this.instance.ctxFactory.create(data);
    return await this.instance.run(ctx).then(data => {
      this.state = RunState.complete;
      this.stateChanged.next(this.state);
      this._resultValue = data;
      this._result.next(data);
      return data;
    });
  }

  _currState: Joinpoint;
  saveState(state: Joinpoint) {
    this._currState = state;
  }

  async stop(): Promise<any> {
    this.state = RunState.stop;
    this.stateChanged.next(this.state);
  }

  async pause(): Promise<any> {
    this.state = RunState.pause;
    this.stateChanged.next(this.state);
  }
}
