import {
  ActivityConfigure,
  ExpressionType,
  CtxType,
  InjectAcitityToken,
  IActivity,
  Task,
  Activity,
  Expression,
} from '@ferrymen/fm-task-core';

import { Inject } from '@ferrymen/fm-ioc-core';

import { isUndefined } from 'util';
import { NodeContextToken, INodeContext, NodeActivityContext } from '../core';

/**
 * test activity configure.
 *
 */
export interface TestConfigure extends ActivityConfigure {
  /**
   * set match test file source.
   *
   */
  enable?: ExpressionType<boolean>;

  /**
   * test framework.
   *
   */
  framework?: ExpressionType<boolean>;
  /**
   * test options.
   *
   */
  options?: CtxType<any>;
}

/**
 * test activity token.
 */
export const TestToken = new InjectAcitityToken<IActivity>('test');

/**
 * test activity.
 *
 */
@Task(TestToken)
export class TestActivity extends Activity<any> {
  /**
   * test options.
   *
   */
  options: any;

  /**
   * eanble test or not.
   *
   */
  enable: Expression<boolean>;

  /**
   * test framework.
   *
   */
  framework: Expression<boolean>;

  /**
   * override to node context
   *
   */
  @Inject(NodeContextToken)
  context: INodeContext;

  async onActivityInit(config: TestConfigure) {
    await super.onActivityInit(config);
    this.options = this.context.to(config.options);
    if (!isUndefined(config.enable)) {
      this.enable = await this.toExpression(config.enable);
    }
    if (config.framework) {
      this.framework = await this.toExpression(config.framework);
    }
  }

  protected async execute(ctx: NodeActivityContext): Promise<void> {
    let test = await this.context.exec(this, this.enable, ctx);
    if (test !== false && this.framework) {
      await this.context.exec(this, this.framework, ctx);
    }
  }
}
