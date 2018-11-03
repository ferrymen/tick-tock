import { Assets } from '../decorators';

import { AssetToken, IAssetActivity } from './AssetConfigure';

import { PipeActivity } from './PipeActivity';

import { SourceActivity } from './SourceActivity';

import { DestActivity } from './DestActivity';

import { SourceMapsActivity } from './SourceMapsActivity';

import { UglifyActivity } from './UglifyActivity';

import { AnnotationActivity, AnnotationsConfigure } from './Annotation';

import { PipeActivityContext } from './PipeActivityContext';

/**
 * Asset Activity
 *
 */
@Assets(AssetToken)
export class AssetActivity extends PipeActivity implements IAssetActivity {
  /**
   * src activity.
   *
   */
  src: SourceActivity;

  /**
   * test activity.
   *
   */
  test: TestActivity;

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

  /**
   * before pipe
   *
   */
  protected async beforePipe(ctx: PipeActivityContext): Promise<void> {
    if (this.test) {
      await this.test.run(ctx);
    }
    if (!(this.watch && ctx.target === this.watch)) {
      await this.src.run(ctx);
      if (this.watch) {
        this.watch.body = this;
        let watchCtx = this.verifyCtx();
        watchCtx.target = this.watch;
        this.watch.run(watchCtx);
      }
    }
    if (this.annotation) {
      await this.annotation.run(ctx);
    }
    if (this.sourcemaps) {
      ctx.sourceMaps = this.sourcemaps;
      await this.sourcemaps.init(ctx);
    }
  }

  /**
   * after pipe.
   *
   */
  protected async afterPipe(ctx: PipeActivityContext): Promise<void> {
    await this.executeUglify(ctx);
    if (isArray(this.dest)) {
      if (this.dest.length > 0) {
        await Promise.all(
          this.dest.map(ds => {
            return this.executeDest(ds, ctx);
          })
        );
      }
    } else if (this.dest) {
      await this.executeDest(this.dest, ctx);
    }
  }

  /**
   * execute uglify.
   *
   */
  protected async executeUglify(ctx: PipeActivityContext) {
    if (this.uglify) {
      await this.uglify.run(ctx);
    }
  }

  /**
   * execute dest activity.
   *
   */
  protected async executeDest(ds: DestActivity, ctx: PipeActivityContext) {
    if (!ds) {
      return;
    }
    return await ds.run(ctx);
  }
}
