import { IActivity } from './IActivity';
import { ActivityContext } from './ActivityContext';
import { Task } from '../decorators';
import { Activity } from './Activity';

/**
 * handle activity interface.
 *
 */
export interface IHandleActivity extends IActivity {
  /**
   * run task.
   *
   */
  run(ctx?: ActivityContext, next?: () => Promise<any>): Promise<any>;
}

/**
 * handle activity base.
 *
 */
@Task
export abstract class HandleActivity extends Activity<any>
  implements IHandleActivity {
  /**
   * run context.
   *
   */
  async run(ctx?: ActivityContext, next?: () => Promise<any>): Promise<any> {
    ctx = this.verifyCtx(ctx);
    await this.execute(ctx, next);
    return ctx.execResult;
  }

  /**
   * execute via ctx.
   *
   */
  protected abstract async execute(
    ctx: ActivityContext,
    next?: () => Promise<any>
  ): Promise<void>;
}
