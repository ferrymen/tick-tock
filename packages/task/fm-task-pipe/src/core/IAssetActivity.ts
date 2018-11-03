/**
 * asset activity.
 *
 */
export interface IAssetActivity extends ITransformActivity {
  /**
   * src activity.
   *y
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
