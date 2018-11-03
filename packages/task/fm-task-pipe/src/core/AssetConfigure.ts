import { DestConfigure } from './DestActivity';
import { IPipeConfigure } from './IPipeConfigure';
import { ExpressionToken, ConfigureType, Src } from '@ferrymen/fm-task-core';
import { SourceActivity, SourceConfigure } from './SourceActivity';
import { AnnotationActivity, AnnotationsConfigure } from './Annotation';

/**
 * dest type.
 */
export type DestType = string | DestConfigure;

/**
 *
 *
 */
export interface AssetConfigure extends IPipeConfigure {
  /**
   * src config.
   *
   */
  src?: ExpressionToken<Src> | ConfigureType<SourceActivity, SourceConfigure>;
  /**
   * watch activity.
   *
   */
  watch?:
    | ExpressionToken<Src | boolean>
    | ConfigureType<WatchActivity, WatchConfigure>;

  /**
   * test config.
   *
   */
  test?: ExpressionToken<Src> | ConfigureType<TestActivity, TestConfigure>;

  /**
   * asset dest activity.
   *
   */
  annotation?:
    | ExpressionToken<string | boolean>
    | ConfigureType<AnnotationActivity, AnnotationsConfigure>;

  /**
   * asset dest activity.
   *
   */
  dest?: ExpressionToken<string> | ConfigureType<DestActivity, DestConfigure>;

  /**
   * uglify asset activity.
   *
   */
  uglify?:
    | ExpressionToken<boolean | ObjectMap<any>>
    | ConfigureType<UglifyActivity, UglifyConfigure>;

  /**
   * create source map or not. default create source map at  `./sourcemaps` for js asset and ts asset.
   *
   */
  sourcemaps?:
    | ExpressionToken<boolean | string>
    | ConfigureType<SourceMapsActivity, SourceMapsConfigure>;
}

/**
 * asset activity.
 *
 */
export interface IAssetActivity extends IPipeActivity {
  /**
   * src activity.
   *
   */
  src: SourceActivity;

  /**
   * dest activity.
   *
   */
  dest: DestActivity | DestActivity[];

  /**
   * watch activity.
   *
   */
  watch: WatchActivity;

  /**
   * source maps activity of asset.
   *
   */
  sourcemaps: SourceMapsActivity;

  /**
   * uglify for asset actvity.
   *
   */
  uglify: UglifyActivity;

  /**
   * asset annotation.
   *
   */
  annotation: AnnotationActivity;

  /**
   * default annottion.
   *
   */
  defaultAnnotation?: AnnotationsConfigure;
}

/**
 * inject asset activity token.
 *
 */
export class InjectAssetActivityToken<
  T extends IAssetActivity
> extends Registration<T> {
  constructor(desc: string) {
    super('AssetActivity', desc);
  }
}

/**
 * asset token.
 */
export const AssetToken = new InjectAssetActivityToken<IAssetActivity>('');

/**
 * asset builder token.
 */
export const AssetBuilderToken = new InjectAcitityBuilderToken<IAssetActivity>(
  AssetToken
);
