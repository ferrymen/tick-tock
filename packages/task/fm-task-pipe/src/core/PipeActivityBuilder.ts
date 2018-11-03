/**
 * pipe task builder.
 *
 */
@Injectable(PipeActivityBuilderToken)
export class PipeActivityBuilder extends ActivityBuilder {
  /**
   * pipe activity build strategy.
   *
   */
  async buildStrategy(
    activity: IActivity,
    config: IPipeConfigure
  ): Promise<IActivity> {
    await super.buildStrategy(activity, config);
    if (activity instanceof PipeActivity) {
      if (config.pipes) {
        activity.pipes = await this.translate(activity, config.pipes);
      }
    }
    return activity;
  }
  /**
   * get pipe default acitvity.
   *
   */
  getDefaultAcitvity() {
    return PipeActivity;
  }

  /**
   * traslate string token.
   *
   */
  protected traslateStrToken(token: string): Token<IPipeActivity> {
    let taskToken: Token<IPipeActivity> = new InjectAssetActivityToken(token);
    if (this.container.has(taskToken)) {
      return taskToken;
    }

    taskToken = new Registration(PipeActivityToken, token);
    if (this.container.has(taskToken)) {
      return taskToken;
    }
    return super.traslateStrToken(token);
  }
  /**
   * translate pipes express.
   *
   */
  protected translate(
    activity: PipeActivity,
    pipes: TransformExpress
  ): Promise<TransformType[]> {
    let trsfs: TransformConfig[] = activity.context.to(pipes);
    if (!trsfs || trsfs.length < 1) {
      return Promise.resolve([]);
    }
    return Promise.all(trsfs.map(p => this.translateConfig(activity, p)));
  }
  /**
   * translate transform config.
   *
   */
  protected async translateConfig(
    activity: PipeActivity,
    tsCfg: TransformConfig
  ): Promise<TransformType> {
    if (isActivityRunner(tsCfg)) {
      return tsCfg;
    } else if (isActivityType(tsCfg)) {
      return await this.buildByConfig(tsCfg, activity.id);
    }

    if (isPromise(tsCfg)) {
      return await tsCfg;
    }

    if (isMetadataObject(tsCfg)) {
      throw new Error('transform configure error');
    }

    return tsCfg as TransformType;
  }
}
