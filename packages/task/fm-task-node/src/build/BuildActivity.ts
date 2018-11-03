import {
  ChainConfigure,
  CtxType,
  Src,
  ExpressionToken,
  ConfigureType,
  Active,
  Task,
  IActivity,
  ChainActivity,
} from '@ferrymen/fm-task-core';

import { Token, Inject, isBoolean } from '@ferrymen/fm-ioc-core';
import { WatchActivity, WatchConfigure } from '../activities';
import { NodeContextToken, INodeContext } from '../core';
import {
  BuildHandleConfigure,
  BuildHandleActivity,
} from './BuildHandleActivity';
import { BuidActivityContext } from './BuidActivityContext';

/**
 * builder configure.
 *
 */
export interface BuildConfigure extends ChainConfigure {
  /**
   * src root.
   *
   */
  src: CtxType<Src>;

  /**
   * build dist.
   *
   */
  dist: CtxType<string>;

  /**
   * handle activities.
   *
   */
  handles?: (BuildHandleConfigure | Token<BuildHandleActivity>)[];

  /**
   * watch
   *
   */
  watch?:
    | ExpressionToken<Src | boolean>
    | ConfigureType<WatchActivity, WatchConfigure>;

  /**
   * before build activity.
   *
   */
  beforeBuildBody?: Active;

  /**
   * do sth, after build completed.
   *
   */
  completedBody?: Active;
}

/**
 * build activity.
 *
 */
@Task('build')
export class BuildActivity extends ChainActivity {
  /**
   * build src root.
   *
   */
  src: Src;

  /**
   * build dist.
   *
   */
  dist: string;
  /**
   * watch activity. watch the build.
   *
   */
  watch: WatchActivity;

  @Inject(NodeContextToken)
  context: INodeContext;

  /**
   * before build body.
   *
   */
  beforeBuildBody: IActivity;

  /**
   * do sth, after build completed.
   *
   */
  completedBody: IActivity;

  async onActivityInit(config: BuildConfigure) {
    await super.onActivityInit(config);
    this.src = this.context.to(config.src);
    if (config.watch) {
      this.watch = await this.toActivity<
        Src | boolean,
        WatchActivity,
        WatchConfigure
      >(
        config.watch,
        act => act instanceof WatchActivity,
        watch => {
          if (isBoolean(watch)) {
            if (watch && this.src) {
              return <WatchConfigure>{ src: this.src, task: WatchActivity };
            }
            return null;
          }
          return <WatchConfigure>{ src: watch, task: WatchActivity };
        }
      );
    }

    if (config.beforeBuildBody) {
      this.beforeBuildBody = await this.buildActivity(config.beforeBuildBody);
    }
    if (config.completedBody) {
      this.completedBody = await this.buildActivity(config.completedBody);
    }
  }

  /**
   * execute once build action.
   *
   */
  protected async execOnce(ctx: BuidActivityContext): Promise<void> {
    if (this.watch) {
      this.watch.body = this;
      let watchCtx = this.verifyCtx();
      watchCtx.target = this.watch;
      this.watch.run(watchCtx);
    }
    ctx.input = await this.context.getFiles(this.src);
  }

  /**
   * execute build action.
   *
   */
  protected async execute(ctx: BuidActivityContext): Promise<void> {
    if (!(this.watch && ctx.target === this.watch)) {
      await this.execOnce(ctx);
    }
    let bctx = this.verifyCtx(ctx.execResult);
    if (this.beforeBuildBody) {
      await this.beforeBuildBody.run(bctx);
    }
    await super.execute(bctx);
    if (this.completedBody) {
      await this.completedBody.run(bctx);
    }
  }

  protected verifyCtx(input?: any): BuidActivityContext {
    let ctx = super.verifyCtx(input) as BuidActivityContext;
    ctx.builder = this;
    return ctx;
  }
}
