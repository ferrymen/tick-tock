/**
 * asset task metadata.
 *
 */
export interface AssetsMetadata extends AssetConfigure {}

/**
 * Asset task decorator, use to define class is a asset task element.
 *
 * @AssetTask
 */
export const Assets: ITaskDecorator<AssetsMetadata> = createTaskDecorator<
  AssetsMetadata
>('Assets', AssetBuilderToken, AssetToken);

/**
 * Asset task decorator, use to define class is a asset task element.
 *
 * @AssetTask
 */
export const AssetTask = Assets;
