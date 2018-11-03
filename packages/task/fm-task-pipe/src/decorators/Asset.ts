import { ITaskDecorator, createTaskDecorator } from '@ferrymen/fm-task-core';

/**
 * asset task metadata.
 *
 */
export interface AssetMetadata extends AssetConfigure {}

/**
 * Asset task decorator, use to define class is a asset task element.
 *
 * @AssetTask
 */
export const Asset: ITaskDecorator<AssetMetadata> = createTaskDecorator<
  AssetMetadata
>('Asset', AssetBuilderToken, AssetToken);
