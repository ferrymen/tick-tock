import { InjectAcitityToken, IActivity } from './IActivity';
import { Task } from '../decorators';
import { Activity } from './Activity';
import { IHandleActivity, HandleActivity } from './HandleActivity';
import { ChainConfigure } from './ActivityConfigure';
import { ActivityContext } from './ActivityContext';

/**
 * chain activity token.
 */
export const ChainActivityToken = new InjectAcitityToken<ChainActivity>(
  'chain'
);

/**
 * chain activity.
 *
 */
@Task(ChainActivityToken)
export class ChainActivity extends Activity<any> {
  protected handles: IHandleActivity[];

  async onActivityInit(config: ChainConfigure): Promise<any> {
    await super.onActivityInit(config);
    if (config.handles && config.handles.length) {
      this.handles = await Promise.all(
        config.handles.map(cfg => this.buildActivity(cfg))
      );
    }
    this.handles = (this.handles || []).filter(
      act => act instanceof HandleActivity
    );
  }

  protected async execute(ctx: ActivityContext): Promise<any> {
    return await this.handleRequest(ctx);
  }

  protected handleRequest(ctx: ActivityContext, next?: () => Promise<any>) {
    let index = -1;
    let handles = this.handles.map(act => {
      return (ctx: ActivityContext, next?: () => Promise<any>) =>
        act.run(ctx, next);
    });
    return dispatch(0);
    function dispatch(idx: number): Promise<any> {
      if (idx <= index) {
        return Promise.reject('next called mutiple times');
      }
      index = idx;
      let handle = handles[idx];
      if (idx === handles.length) {
        handle = next;
      }
      if (!handle) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(handle(ctx, dispatch.bind(null, idx + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  use(activity: IActivity) {
    if (activity instanceof HandleActivity) {
      this.handles.push(activity);
    }
  }
}
