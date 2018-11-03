import {
  Injectable,
  Token,
  Type,
  Express,
  isToken,
  isString,
  isFunction,
} from '@ferrymen/fm-ioc-core';
import { ActivityBuilderToken, IActivityBuilder } from './IActivityBuilder';
import { AnnotationBuilder } from '@ferrymen/fm-boot';
import { IActivity, ActivityInstance, InjectAcitityToken } from './IActivity';
import {
  ActivityConfigure,
  ActivityType,
  ExpressionType,
  Expression,
  isActivityType,
} from './ActivityConfigure';
import { ContextFactory } from './ContextFactory';
import { NullActivity } from './Activity';
import { Task } from '../decorators';
import { AssignActivity } from './AssignActivity';

/**
 * activity builder.
 *
 */
@Injectable(ActivityBuilderToken)
export class ActivityBuilder extends AnnotationBuilder<IActivity>
  implements IActivityBuilder {
  build(
    token: Token<IActivity>,
    config: ActivityConfigure,
    data?: any
  ): Promise<IActivity> {
    return super.build(token, config, data);
  }

  buildByConfig(activity: ActivityType<any>, data: any) {
    return super.buildByConfig(activity, data);
  }

  async createInstance(
    token: Token<IActivity>,
    config: ActivityConfigure,
    uuid: string
  ): Promise<IActivity> {
    if (isString(token)) {
      token = this.traslateStrToken(token);
    }

    let instance = (await super.createInstance(
      token,
      config,
      uuid
    )) as ActivityInstance;
    if (!instance) {
      return null;
    }

    if (isString(uuid)) {
      instance.id = uuid;
    }

    instance.ctxFactory = this.container.resolve(ContextFactory, {
      type: token,
    });

    if (isFunction(instance.onActivityInit)) {
      await Promise.resolve(instance.onActivityInit(config));
    }
    return instance;
  }

  async buildStrategy(
    activity: IActivity,
    config: ActivityConfigure,
    data?: any
  ): Promise<IActivity> {
    if (config.name) {
      activity.name = config.name;
    }
    activity.config = config;
    return activity;
  }

  getDefaultAcitvity(): Type<IActivity> {
    return NullActivity;
  }

  getType(config: ActivityConfigure): Token<IActivity> {
    let token = config.activity || config.task || config.token || config.type;
    if (isString(token)) {
      token = this.traslateStrToken(token);
    }
    return token;
  }

  getDecorator() {
    return Task.toString();
  }

  protected resolveToken(token: Token<IActivity>, uuid?: string): IActivity {
    let activity = this.container.resolve(token);
    activity.id = uuid;
    return activity;
  }

  protected traslateStrToken(token: string): Token<IActivity> {
    let taskToken = new InjectAcitityToken(token);
    if (this.container.has(taskToken)) {
      return taskToken;
    }
    return token;
  }

  /**
   * to expression
   *
   */
  async toExpression<T>(
    exptype: ExpressionType<T>,
    target: IActivity
  ): Promise<Expression<T>> {
    if (isActivityType(exptype)) {
      return (await this.buildByConfig(exptype, target.id)) as AssignActivity<
        T
      >;
    } else {
      return exptype as Expression<T>;
    }
  }

  /**
   * to activity.
   *
   */
  async toActivity<Tr, Ta extends IActivity, TCfg extends ActivityConfigure>(
    exptype: ExpressionType<Tr> | ActivityType<Ta>,
    target: IActivity,
    isRightActivity: Express<Ta, boolean>,
    toConfig: Express<Tr, TCfg>,
    valify?: Express<TCfg, TCfg>
  ): Promise<Ta> {
    let result;
    if (isActivityType(exptype, !valify)) {
      if (valify) {
        result = await this.buildByConfig(
          isToken(exptype) ? exptype : valify(exptype as TCfg),
          target.id
        );
      } else {
        result = await this.buildByConfig(exptype, target.id);
      }
    } else {
      result = exptype;
    }

    if (isRightActivity(result)) {
      return result;
    }

    let rt;
    if (isString(result)) {
      rt = result;
    } else {
      rt = await target.context.exec(target, result);
    }
    let config = toConfig(rt);
    if (valify) {
      config = valify(config);
    }
    if (config) {
      result = await this.buildByConfig(config, target.id);
    } else {
      result = null;
    }
    return result;
  }
}
