import { Inject, Express } from '@ferrymen/fm-ioc-core';
import { GActivity, IActivity, ActivityToken } from './IActivity';
import { OnActivityInit } from './OnActivityInit';
import {
  ActivityConfigure,
  ExpressionType,
  Expression,
  ActivityType,
} from './ActivityConfigure';
import { ContextToken, IContext } from './IContext';
import { ContextFactory } from './ContextFactory';
import { ActivityContext } from './ActivityContext';
import { Task } from '../decorators';

/**
 * base activity.
 *
 */
@Task
export abstract class Activity<T> implements GActivity<T>, OnActivityInit {
  /**
   * workflow instance uuid.
   *
   */
  id: string;
  /**
   * activity display name.
   *
   */
  name: string;
  /**
   * config.
   *
   */
  config: ActivityConfigure;

  /**
   * task context.
   *
   */
  @Inject(ContextToken)
  context: IContext;

  /**
   * context factory.
   *
   */
  ctxFactory: ContextFactory;

  constructor() {}

  async onActivityInit(config: ActivityConfigure) {
    this.config = config;
  }

  /**
   * run task.
   *
   */
  async run(ctx?: ActivityContext): Promise<any> {
    ctx = this.verifyCtx(ctx);
    await this.execute(ctx);
    return ctx.execResult;
  }

  /**
   * execute activity.
   *
   */
  protected abstract execute(ctx: ActivityContext): Promise<void>;

  /**
   * verify context.
   *
   */
  protected verifyCtx(ctx?: any): ActivityContext {
    if (!ctx || !(ctx instanceof ActivityContext)) {
      ctx = this.ctxFactory.create(ctx);
    }
    return ctx;
  }

  protected toExpression<T>(
    exptype: ExpressionType<T>,
    target?: IActivity
  ): Promise<Expression<T>> {
    return this.context.builder.toExpression(exptype, target || this);
  }

  protected toActivity<
    Tr,
    Ta extends IActivity,
    TCfg extends ActivityConfigure
  >(
    exptype: ExpressionType<Tr> | ActivityType<Ta>,
    isRightActivity: Express<any, boolean>,
    toConfig: Express<Tr, TCfg>,
    valify?: Express<TCfg, TCfg>,
    target?: IActivity
  ): Promise<Ta> {
    return this.context.builder.toActivity<Tr, Ta, TCfg>(
      exptype,
      target || this,
      isRightActivity,
      toConfig,
      valify
    );
  }

  protected buildActivity<T extends IActivity>(
    config: ActivityType<T>
  ): Promise<T> {
    return this.context.builder.buildByConfig(config, this.id) as Promise<T>;
  }
}

/**
 * null activity. do nothing.
 *
 */
@Task(ActivityToken)
export class NullActivity extends Activity<any> {
  protected async execute(ctx: ActivityContext): Promise<void> {}
}
