import { ContextActivity } from '@ferrymen/fm-task-core';

import { Inject } from '@ferrymen/fm-ioc-core';
import { NodeContextToken, INodeContext } from './INodeContext';
import { NodeActivityContext } from './NodeActivityContext';

/**
 * node activity.
 *
 */
export abstract class NodeActivity extends ContextActivity {
  /**
   * override to node context
   *
   */
  @Inject(NodeContextToken)
  context: INodeContext;

  protected verifyCtx(input?: any): NodeActivityContext {
    return super.verifyCtx(input) as NodeActivityContext;
  }

  /**
   * execute build activity.
   *
   */
  protected abstract async execute(ctx: NodeActivityContext): Promise<void>;
}
