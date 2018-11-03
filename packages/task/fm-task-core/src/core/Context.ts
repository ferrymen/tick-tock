import { ContextToken, IContext, CtxType } from './IContext';
import {
  Singleton,
  Inject,
  ContainerToken,
  IContainer,
  ObjectMap,
  isClass,
  isPromise,
  Type,
  hasOwnClassMetadata,
} from '@ferrymen/fm-ioc-core';
import { AppConfigureToken } from '@ferrymen/fm-boot';
import { isFunction } from 'util';
import { ActivityBuilderToken } from './IActivityBuilder';
import { ActivityBuilder } from './ActivityBuilder';
import { ActivityConfigure, Expression } from './ActivityConfigure';
import { IActivity } from './IActivity';
import { ActivityContext } from './ActivityContext';
import { Activity } from './Activity';
import { ActivityRunner } from './ActivityRunner';
import { Task } from '../decorators';

/**
 * task context.
 *
 */
@Singleton(ContextToken)
export class Context implements IContext {
  @Inject(ContainerToken)
  private container: IContainer;

  @Inject(ActivityBuilderToken)
  builder: ActivityBuilder;

  constructor() {}

  getContainer(): IContainer {
    return this.container;
  }

  getRootPath(): string {
    let cfg = this.getContainer().get(AppConfigureToken) || {};
    return cfg.baseURL || '.';
  }

  getEnvArgs(): ObjectMap<any> {
    return {};
  }

  to<T>(target: CtxType<T>, config?: ActivityConfigure): T {
    if (isFunction(target)) {
      if (isClass(target)) {
        return target as any;
      }
      // return target(this, config);
    } else {
      return target as any;
    }
  }

  /**
   * exec activity result.
   *
   */
  exec<T>(
    target: IActivity,
    expression: Expression<T>,
    ctx?: ActivityContext
  ): Promise<T> {
    if (isFunction(expression)) {
      // return expression(target, ctx);
    } else if (isPromise(expression)) {
      return expression;
    } else if (expression instanceof Activity) {
      return expression.run(ctx);
    } else if (expression instanceof ActivityRunner) {
      return expression.start(ctx);
    } else {
      return Promise.resolve(expression as T);
    }
  }

  isTask(task: Type<IActivity>): boolean {
    return hasOwnClassMetadata(Task, task);
  }
}
