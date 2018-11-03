/**
 * package activity.
 *
 */
@Package(PackageToken)
export class PackageActivity extends SequenceActivity
  implements IPackageActivity {
  /**
   * dest activity.
   *
   */
  dest: DestActivity;
  /**
   * test activity.
   *
   */
  test: TestActivity;
  /**
   * clean activity.
   *
   */
  clean: CleanActivity;
  /**
   * src root pacth.
   *
   */
  src: string;
  /**
   * assets activities.
   *
   */
  assets: IActivity[] = [];
  /**
   * assets execute control type.
   *
   */
  executeType: Type<SequenceActivity | ParallelActivity>;

  protected async execute(ctx: PipeActivityContext) {
    if (this.test) {
      await this.test.run(ctx);
    }
    if (this.clean) {
      await this.clean.run(ctx);
    }
    await this.execAssets(ctx);
    await super.execute(ctx);
  }

  protected verifyCtx(input?: any) {
    return this.context
      .getContainer()
      .resolve(PipeActivityContext, {
        provide: InputDataToken,
        useValue: input,
      });
  }

  /**
   * execute assets.
   *
   */
  protected execAssets(ctx: PipeActivityContext) {
    this.executeType = this.executeType || SequenceActivity;
    let execute = this.context.getContainer().resolve(this.executeType);
    execute.activities = this.assets;
    return execute.run(ctx);
  }
}
