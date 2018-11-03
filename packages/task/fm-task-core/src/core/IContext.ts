import { ActivityConfigure, Expression } from './ActivityConfigure';
import {
  Registration,
  IContainer,
  ObjectMap,
  Type,
} from '@ferrymen/fm-ioc-core';
import { IActivity } from './IActivity';
import { IActivityContext } from './ActivityContext';
import { ActivityBuilder } from './ActivityBuilder';

/**
 * context type.
 */
export type CtxType<T> =
  | T
  | ((context?: IContext, config?: ActivityConfigure) => T);

/**
 * Inject Acitity context Token
 *
 */
export class InjectContextToken<T> extends Registration<T> {
  constructor(desc: string) {
    super('ActivityContext', desc);
  }
}

/**
 * task context token.
 */
export const ContextToken = new InjectContextToken<IContext>('');

/**
 * task context.
 *
 */
export interface IContext {
  /**
   * default builder.
   *
   */
  builder: ActivityBuilder;

  /**
   * get ioc container.
   *
   */
  getContainer(): IContainer;

  /**
   * get base URL.
   *
   */
  getRootPath(): string;

  /**
   * get task evn args.
   *
   */
  getEnvArgs(): ObjectMap<any>;

  /**
   *convert to finally type via context.
   *
   */
  to<T>(target: CtxType<T>, config?: ActivityConfigure): T;

  /**
   * exec activity result.
   *
   */
  exec<T>(
    target: IActivity,
    expression: Expression<T>,
    ctx?: IActivityContext<any>
  ): Promise<T>;

  /**
   * check is task or not.
   *
   */
  isTask(task: Type<IActivity>): boolean;
}
