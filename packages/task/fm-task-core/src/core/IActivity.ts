import { Registration } from '@ferrymen/fm-ioc-core';

import { OnActivityInit } from './OnActivityInit';
import { ContextFactory } from './ContextFactory';
import { ActivityConfigure } from './ActivityConfigure';
import { IActivityContext } from './ActivityContext';
import { IContext } from './IContext';

/**
 * Inject AcitityToken
 *
 */
export class InjectAcitityToken<T extends IActivity> extends Registration<T> {
  constructor(desc: string) {
    super('Activity', desc);
  }
}

/**
 * task token.
 */
export const ActivityToken = new InjectAcitityToken<IActivity>('');

/**
 * activity instance.
 */
export type ActivityInstance = IActivity & OnActivityInit;

/**
 * activity object.
 *
 */
export interface IActivity {
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
   * task context.
   *
   */
  context: IContext;

  /**
   * context factory.
   *
   */
  ctxFactory: ContextFactory;

  /**
   * config.
   *
   */
  config: ActivityConfigure;

  /**
   * run task.
   *
   */
  run(ctx?: IActivityContext<any>): Promise<any>;
}

/**
 * typed result activity.
 *
 */
export interface GActivity<T> extends IActivity {
  /**
   * run activity.
   *
   */
  run(ctx?: IActivityContext<T>): Promise<T>;
}
