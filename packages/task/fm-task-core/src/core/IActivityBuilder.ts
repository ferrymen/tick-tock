import { IActivity } from './IActivity';
import { Token } from '@ferrymen/fm-ioc-core';
import { InjectAnnotationBuilder, IAnnotationBuilder } from '@ferrymen/fm-boot';
import { ActivityType } from './ActivityConfigure';
import { Activity } from './Activity';

/**
 * Inject Acitity builder Token
 *
 */
export class InjectAcitityBuilderToken<
  T extends IActivity
> extends InjectAnnotationBuilder<T> {
  constructor(type: Token<T>) {
    super(type);
  }
}

/**
 * activity boot builder.
 *
 */
export interface IActivityBuilder extends IAnnotationBuilder<IActivity> {
  /**
   * build by config.
   *
   */
  buildByConfig(activity: ActivityType<any>, data: any): Promise<IActivity>;
}

/**
 * activity builder token.
 */
export const ActivityBuilderToken = new InjectAcitityBuilderToken<IActivity>(
  Activity
);
