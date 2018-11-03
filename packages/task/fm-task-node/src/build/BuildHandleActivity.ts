import {
  HandleConfigure,
  ExpressionType,
  Active,
  CtxType,
  Task,
  HandleActivity,
  IActivity,
  Expression,
} from '@ferrymen/fm-task-core';
import { Inject, Token, isToken, isRegExp } from '@ferrymen/fm-ioc-core';
import { NodeContextToken, INodeContext } from '../core';
import { BuidActivityContext } from './BuidActivityContext';
import minimatch from 'minimatch';
import { CompilerActivity } from './CompilerActivity';
import { CompilerActivityContext } from './CompilerActivityContext';

/**
 * handle config
 *
 */
export interface BuildHandleConfigure extends HandleConfigure {
  /**
   * file filter
   *
   */
  test: ExpressionType<string | RegExp>;

  /**
   * compiler
   *
   */
  compiler: Active;

  /**
   * sub dist
   *
   */
  subDist?: CtxType<string>;
}

/**
 * build handle activity.
 *
 */
@Task('build-handle')
export class BuildHandleActivity extends HandleActivity {
  /**
   * override to node context
   *
   */
  @Inject(NodeContextToken)
  context: INodeContext;

  /**
   * compiler.
   *
   */
  compiler: IActivity;

  /**
   * compiler token.
   *
   */
  compilerToken: Token<IActivity>;

  /**
   * sub dist.
   *
   */
  subDist: string;

  /**
   * file filter.
   *
   */
  test: Expression<string | RegExp>;

  async onActivityInit(config: BuildHandleConfigure) {
    await super.onActivityInit(config);
    if (isToken(config.compiler)) {
      this.compilerToken = config.compiler;
    } else {
      this.compilerToken = this.context.builder.getType(config.compiler);
    }
    this.compiler = await this.buildActivity(config.compiler);
    this.test = await this.toExpression(config.test);
    this.subDist = this.context.to(config.subDist) || '';
  }

  /**
   * handle build via files.
   *
   */
  protected async execute(
    ctx: BuidActivityContext,
    next?: () => Promise<any>
  ): Promise<void> {
    if (ctx.isCompleted()) {
      return;
    }
    let test = await this.context.exec(this, this.test, ctx);
    let files: string[];

    if (isRegExp(test)) {
      let exp = test;
      files = ctx.execResult.filter(f => exp.test(f));
    } else if (test) {
      let match = test;
      files = ctx.execResult.filter(f => minimatch(f, match));
    }
    if (!files || files.length < 1) {
      let compCtx = this.ctxFactory.create(
        files,
        this.compilerToken,
        CompilerActivity
      ) as CompilerActivityContext;
      compCtx.builder = ctx.builder;
      compCtx.handle = this;
      await this.compiler.run(compCtx);
      ctx.complete(files);
    }
    if (!ctx.isCompleted()) {
      await next();
    }
  }
}
