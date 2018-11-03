/**
 * source activity token.
 */
export const SourceAcitvityToken = new InjectPipeActivityToken<SourceActivity>(
  'source'
);

/**
 * source pipe configure.
 *
 */
export interface SourceConfigure extends IPipeConfigure {
  /**
   * transform source.
   *
   */
  src: ExpressionType<Src>;

  /**
   * src options.
   *
   */
  srcOptions?: ExpressionType<SrcOptions>;
}

/**
 * Source activity.
 *
 */
@PipeTask(SourceAcitvityToken)
export class SourceActivity extends PipeActivity {
  /**
   * source
   *
   */
  src: Expression<Src>;

  /**
   * source options.
   *e
   */
  srcOptions: Expression<SrcOptions>;

  async onActivityInit(config: SourceConfigure) {
    await super.onActivityInit(config);
    this.src = await this.toExpression(config.src);

    if (config.srcOptions) {
      this.srcOptions = await this.toExpression(config.srcOptions);
    }
  }

  /**
   * begin pipe.
   *
   */
  protected async beforePipe(ctx: PipeActivityContext): Promise<void> {
    let src = await this.context.exec(this, this.src, ctx);
    let srcOptions = await this.context.exec(this, this.srcOptions, ctx);
    ctx.input = src;
    ctx.data = this.source(src, srcOptions);
  }

  source(source: Src, srcOptions: SrcOptions): ITransform {
    return src(source, srcOptions);
  }
}
