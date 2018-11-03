import {
  InjectAcitityToken,
  ActivityConfigure,
  ExpressionType,
  Src,
  Task,
  Activity,
  Expression,
  ActivityContext,
} from '@ferrymen/fm-task-core';

import { Inject } from '@ferrymen/fm-ioc-core';
import { NodeContextToken, INodeContext } from '../core';

/**
 * clean task token.
 */
export const CleanToken = new InjectAcitityToken<CleanActivity>('clean');

/**
 * clean configure
 *
 */
export interface CleanConfigure extends ActivityConfigure {
  /**
   * clean match.
   *
   */
  clean: ExpressionType<Src>;
}

/**
 * clean task.
 */
@Task(CleanToken)
export class CleanActivity extends Activity<any> {
  /**
   * context.
   *
   */
  @Inject(NodeContextToken)
  context: INodeContext;
  /**
   * clean source.
   *
   */
  clean: Expression<Src>;

  async onActivityInit(config: CleanConfigure) {
    await super.onActivityInit(config);
    this.clean = await this.toExpression(config.clean);
  }

  /**
   * run clean.
   *
   */
  protected async execute(ctx?: ActivityContext): Promise<void> {
    let clean = await this.context.exec(this, this.clean, ctx);
    await this.context.del(clean);
  }
}
