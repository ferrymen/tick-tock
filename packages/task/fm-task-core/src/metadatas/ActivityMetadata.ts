import { IAnnotationMetadata } from '@ferrymen/fm-ioc-core';
import { IActivity, CoreActivityConfigs } from '../core';

/**
 * task metadata.
 *
 */
export interface IActivityMetadata extends IAnnotationMetadata<IActivity> {
  decorType?: string;
}

/**
 * activity metadata.
 */
export type ActivityMetadata = IActivityMetadata & CoreActivityConfigs;
