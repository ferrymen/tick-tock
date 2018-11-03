/**
 * source map configure
 *
 */
export interface SourceMapsConfigure extends ActivityConfigure {
  /**
   * sourcemaps.
   */
  sourcemaps?: CtxType<string>;
}

/**
 * source maps token.
 */
export const SourceMapsToken = new InjectAcitityToken<SourceMapsActivity>(
  'sourcemaps'
);

/**
 * source maps token.
 *
 */
@Task(SourceMapsToken)
export class SourceMapsActivity extends Activity<ITransform>
  implements OnActivityInit {
  sourcemaps: string;

  async onActivityInit(config: SourceMapsConfigure) {
    await super.onActivityInit(config);
    this.sourcemaps = this.context.to(config.sourcemaps) || './sourcemaps';
  }

  private hasInit = false;

  protected async execute(ctx: PipeActivityContext) {
    if (!this.hasInit) {
      ctx.data = ctx.data.pipe(sourcemaps.init());
    } else {
      ctx.data = ctx.data.pipe(sourcemaps.write(this.sourcemaps));
    }
  }

  async init(ctx: PipeActivityContext) {
    this.hasInit = false;
    await this.run(ctx);
    this.hasInit = true;
  }

  async write(ctx: PipeActivityContext) {
    if (this.hasInit) {
      return;
    }
    await this.run(ctx);
  }
}
