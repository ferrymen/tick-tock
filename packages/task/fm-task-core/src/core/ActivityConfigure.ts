import { IActivity, GActivity } from './IActivity';
import { IActivityContext } from './ActivityContext';
import {
  Token,
  isString,
  isToken,
  isMetadataObject,
} from '@ferrymen/fm-ioc-core';
import { ModuleConfig } from '@ferrymen/fm-boot';
import { ExpressionActivity } from './ExpressionActivity';
import { IActivityRunner } from './IActivityRunner';
import { IHandleActivity } from './HandleActivity';

/**
 * key value pair.
 *
 */
export interface KeyValue<TKey, TVal> {
  key: TKey;
  value: TVal;
}

/**
 * async result.
 */
export type AsyncResult<T> = (
  activity?: IActivity,
  ctx?: IActivityContext<T>
) => Promise<T>;

/**
 * activity result.
 */
export type ActivityResult<T> =
  | Promise<T>
  | AsyncResult<T>
  | ExpressionActivity<T>
  | IActivityRunner<T>;

/**
 * expression.
 */
export type Expression<T> = T | ActivityResult<T>;

/**
 * condition expression.
 */
export type Condition = Expression<boolean>;
/**
 *  expression token.
 */
export type ExpressionToken<T> = Expression<T> | Token<ExpressionActivity<T>>;

/**
 * ActivityResult type
 */
export type ActivityResultType<T> =
  | Token<GActivity<T>>
  | Token<any>
  | IActivityConfigure<T>;

/**
 * expression type.
 */
export type ExpressionType<T> = Expression<T> | ActivityResultType<T>;

/**
 * core activities configures.
 */
export type GCoreActivityConfigs<T> =
  | ActivityConfigure
  | ChainConfigure
  | IDependenceConfigure<T>
  | ConfirmConfigure
  | IDelayConfigure<T>
  | IDoWhileConfigure<T>
  | IIfConfigure<T>
  | IIntervalConfigure<T>
  | IParallelConfigure<T>
  | ISequenceConfigure<T>
  | ISwitchConfigure<T>
  | ThrowConfigure
  | ITryCatchConfigure<T>
  | IWhileConfigure<T>;

/**
 * core activities configures.
 */
export type CoreActivityConfigs =
  | ActivityConfigure
  | ChainConfigure
  | DependenceConfigure
  | ConfirmConfigure
  | DelayConfigure
  | DoWhileConfigure
  | IfConfigure
  | IntervalConfigure
  | ParallelConfigure
  | SequenceConfigure
  | SwitchConfigure
  | ThrowConfigure
  | TryCatchConfigure
  | WhileConfigure;

/**
 * activity type.
 */
export type ActivityType<T extends IActivity> = Token<T> | CoreActivityConfigs;

export type Active = ActivityType<IActivity>;

/**
 * activity configure type.
 */
export type ConfigureType<T extends IActivity, TC extends ActivityConfigure> =
  | Token<T>
  | TC;

/**
 * target is activity runner.
 *
 */
export function isActivityRunner(target: any): target is IActivityRunner<any> {
  return target instanceof isActivityRunner;
}

/**
 * check target is activity type or not.
 *
 */
export function isActivityType(
  target: any,
  check = true
): target is ActivityType<any> {
  if (!target) {
    return false;
  }

  if (isActivityRunner(target)) {
    return false;
  }

  // forbid string token for activity.
  if (isString(target)) {
    return false;
  }

  if (isToken(target)) {
    return true;
  }

  if (isMetadataObject(target)) {
    if (check) {
      return !!(target.activity || target.task || target.bootstrap);
    }
    return true;
  }

  return false;
}

/**
 * ActivityConfigure
 *
 */
export interface IActivityConfigure<T> extends ModuleConfig<T> {
  /**
   * workflow uuid.
   *
   */
  id?: string;

  /**
   * context tasks name.
   *
   */
  name?: string;

  /**
   * run baseURL.
   *
   */
  baseURL?: string;

  /**
   * custom data.
   *
   */
  data?: any;

  /**
   * activity module.
   *
   */
  task?: Token<T>;

  /**
   * activity module.
   *
   */
  activity?: Token<T>;
}

/**
 * task configure.
 *
 */
export interface ActivityConfigure extends IActivityConfigure<IActivity> {}

export interface HandleConfigure extends ActivityConfigure {}

/**
 * chain configure.
 *
 */
export interface ChainConfigure extends ActivityConfigure {
  /**
   * handle activities.
   *
   */
  handles?: (Token<IHandleActivity> | HandleConfigure)[];
}

/**
 * Confirm activity configure.
 *
 */
export interface ConfirmConfigure extends ActivityConfigure {
  /**
   * confirm expression.
   *
   */
  confirm: ExpressionType<boolean>;
}

/**
 * Dependence activity configure.
 *
 */
export interface IDependenceConfigure<T> extends ActivityConfigure {
  /**
   * dependence activity.
   *
   */
  dependence: T;

  /**
   * target dependence
   *
   */
  body: T;
}

/**
 * depdence configure.
 *
 */
export interface DependenceConfigure extends IDependenceConfigure<Active> {}

/**
 * delay activity configure.
 *
 */
export interface IDelayConfigure<T> extends ActivityConfigure {
  /**
   * delay ms.
   *
   */
  delay: ExpressionType<number>;

  /**
   * delay body.
   *
   */
  body?: T;
}

/**
 * delay activity configure.
 *
 */
export interface DelayConfigure extends IDelayConfigure<Active> {}

/**
 * DoWhile activity configure.
 *
 */
export interface IDoWhileConfigure<T> extends ActivityConfigure {
  /**
   * do while
   *
   */
  do: Active;

  /**
   * while condition
   *
   */
  while: ExpressionType<boolean>;
}

/**
 * DoWhile activity configure.
 *
 */
export interface DoWhileConfigure extends IDoWhileConfigure<Active> {}

/**
 * If activity configure.
 *
 */
export interface IIfConfigure<T> extends ActivityConfigure {
  /**
   * while condition
   *
   */
  if: ExpressionType<boolean>;

  /**
   * if body
   *
   */
  ifBody: T;

  /**
   * else body
   *
   */
  elseBody?: T;
}

/**
 * If activity configure.
 *
 */
export interface IfConfigure extends IIfConfigure<Active> {}

/**
 * Interval activity configure.
 *
 */
export interface IIntervalConfigure<T> extends ActivityConfigure {
  /**
   * Interval ms.
   *
   */
  interval: ExpressionType<number>;

  /**
   * Interval body.
   *
   */
  body: T;
}

/**
 * Interval activity configure.
 *
 */
export interface IntervalConfigure extends IIntervalConfigure<Active> {}

/**
 *  Parallel activity configure.
 *
 */
export interface IParallelConfigure<T> extends ActivityConfigure {
  /**
   * parallel activities.
   *
   */
  parallel: T[];
}
/**
 * Parallel activity configure.
 *
 */
export interface ParallelConfigure extends IParallelConfigure<Active> {}

/**
 * sequence activity configure.
 *
 */
export interface ISequenceConfigure<T> extends ActivityConfigure {
  /**
   * sequence activities.
   *
   */
  sequence: T[];
}

/**
 * sequence activity configure.
 *
 */
export interface SequenceConfigure extends ISequenceConfigure<Active> {}

/**
 * Switch activity configure.
 *
 */
export interface ISwitchConfigure<T> extends ActivityConfigure {
  /**
   * while condition
   *
   */
  expression: ExpressionType<any>;

  /**
   * if body
   *
   */
  cases: KeyValue<any, T>[];

  /**
   * default body
   *
   */
  defaultBody?: T;
}
/**
 * Switch activity configure.
 *
 */
export interface SwitchConfigure extends ISwitchConfigure<Active> {}

/**
 * Throw activity configure.
 *
 */
export interface ThrowConfigure extends ActivityConfigure {
  /**
   * delay ms.
   *
   */
  exception?: Expression<Error> | ActivityResultType<Error>;
}

/**
 * TryCatch activity configure.
 *
 */
export interface ITryCatchConfigure<T> extends ChainConfigure {
  /**
   * try activity.
   *
   */
  try: T;

  /**
   * catchs activities.
   *
   */
  catchs: IHandleActivity[];

  /**
   * finally activity.
   *
   */
  finally?: T;
}

/**
 * TryCatch activity configure.
 *
 */
export interface TryCatchConfigure extends ITryCatchConfigure<Active> {}

/**
 * While activity configure.
 *
 */
export interface IWhileConfigure<T> extends ActivityConfigure {
  /**
   * while condition
   *
   */
  while: ExpressionType<boolean>;

  /**
   * while body.
   *
   */
  body: T;
}

/**
 * While activity configure.
 *
 */
export interface WhileConfigure extends IWhileConfigure<Active> {}
