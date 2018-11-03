/**
 * uglify activity configure.
 *
 */
export interface UglifyConfigure extends ActivityConfigure {
  /**
   * uglify options.
   *
   */
  uglifyOptions?: CtxType<any>;
}

/**
 *  uglify token.
 */
export const UglifyToken = new InjectAcitityToken<UglifyActivity>('uglify');

/**
 * uglify activity.
 *
 */
@Task(UglifyToken)
export class UglifyActivity extends Activity<ITransform>
  implements OnActivityInit {
  /**
   * uglify options
   *
   */
  uglifyOptions: any;

  async onActivityInit(config: UglifyConfigure) {
    await super.onActivityInit(config);
    this.uglifyOptions = this.context.to(config.uglifyOptions);
  }

  protected async execute(ctx: PipeActivityContext) {
    if (this.uglifyOptions) {
      ctx.data = ctx.data.pipe(uglify(this.uglifyOptions));
    } else {
      ctx.data = ctx.data.pipe(uglify());
    }
  }
}
