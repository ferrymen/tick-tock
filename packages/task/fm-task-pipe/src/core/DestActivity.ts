/**
 * dest activity token.
 */
export const DestAcitvityToken = new InjectPipeActivityToken<DestActivity>(
  'dest'
);

/**
 * dest pipe configure.
 *
 */
export interface DestConfigure extends IPipeConfigure {
  /**
   * pipe dest.
   *
   */
  dest?: ExpressionType<string>;

  /**
   * dest options.
   *
   */
  destOptions?: ExpressionType<DestOptions>;
}

/**
 * pipe dest activity.
 *
 */
@PipeTask(DestAcitvityToken)
export class DestActivity extends PipeActivity {
  /**
   * source
   *
   */
  dest: Expression<string>;

  /**
   * source options.
   *
   */
  destOptions: Expression<DestOptions>;

  async onActivityInit(config: DestConfigure) {
    await super.onActivityInit(config);
    this.dest = await this.toExpression(config.dest);

    if (config.destOptions) {
      this.destOptions = await this.toExpression(config.destOptions);
    }
  }

  protected async afterPipe(ctx: PipeActivityContext): Promise<void> {
    await super.afterPipe(ctx);
    if (ctx.sourceMaps instanceof SourceMapsActivity) {
      await ctx.sourceMaps.run(ctx);
    }
    await this.writeStream(ctx);
  }

  /**
   * write dest stream.
   *
   */
  protected async writeStream(ctx: PipeActivityContext): Promise<void> {
    let dist = await this.context.exec(this, this.dest, ctx);
    let destOptions = undefined;
    if (this.destOptions) {
      destOptions = await this.context.exec(this, this.destOptions, ctx);
    }
    dist = this.context.toRootPath(dist);
    await this.executePipe(ctx.data, ctx, dest(dist, destOptions), true);
  }
}
