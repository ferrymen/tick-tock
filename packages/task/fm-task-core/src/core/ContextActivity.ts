import { IActivity } from './IActivity';
import { Registration, Type } from '@ferrymen/fm-ioc-core';
import { Task } from '../decorators';
import { Activity } from './Activity';
import { ActivityContext } from './ActivityContext';

/**
 * before dependence activity inject token.
 *
 */
export class InjectBeforeActivity<T extends IActivity> extends Registration<T> {
  constructor(type: Type<T>) {
    super(type, 'BeforeDepActivity');
  }
}

/**
 * after dependence activity inject token.
 *
 */
export class InjectAfterActivity<T extends IActivity> extends Registration<T> {
  constructor(type: Type<T>) {
    super(type, 'AfterDepActivity');
  }
}

/**
 * activity with before after context.
 *
 */
@Task
export abstract class ContextActivity extends Activity<any> {
  /**
   * run task.
   *
   */
  async run(ctx?: ActivityContext): Promise<any> {
    ctx = this.verifyCtx(ctx);
    await this.before(ctx);
    await this.execute(ctx);
    await this.after(ctx);
    return ctx.execResult;
  }

  /**
   * before run sequence.
   *
   */
  protected async before(ctx: ActivityContext): Promise<void> {
    if (this.config && this.config.type) {
      let dep = this.context
        .getContainer()
        .getRefService(InjectBeforeActivity, this.config.type);
      if (dep) {
        await dep.run(ctx);
      }
    }
  }

  /**
   * execute the activity body.
   *
   */
  protected abstract async execute(ctx: ActivityContext): Promise<void>;

  /**
   * after run sequence.
   *
   */
  protected async after(ctx: ActivityContext): Promise<void> {
    if (this.config && this.config.type) {
      let dep = this.context
        .getContainer()
        .getRefService(InjectAfterActivity, this.config.type);
      if (dep) {
        await dep.run(ctx);
      }
    }
  }
}
