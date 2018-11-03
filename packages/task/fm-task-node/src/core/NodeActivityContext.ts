import {
  InjectActivityContextToken,
  ActivityContext,
  InputDataToken,
} from '@ferrymen/fm-task-core';
import { Injectable, Inject } from '@ferrymen/fm-ioc-core';
import { INodeContext, NodeContextToken } from './INodeContext';
import { NodeActivity } from './NodeActivity';
import { FileChanged } from '../activities';

/**
 * node activity context token.
 */
export const NodeActivityContextToken = new InjectActivityContextToken(
  NodeActivity
);

/**
 * pipe activity context.
 *
 */
@Injectable(NodeActivityContextToken)
export class NodeActivityContext extends ActivityContext {
  /**
   * ovverid to node context
   *
   */
  context: INodeContext;

  constructor(
    @Inject(InputDataToken) input: any,
    @Inject(NodeContextToken) context: INodeContext
  ) {
    super(input, context);
  }

  protected translate(input: any): any {
    input = super.translate(input);
    if (input instanceof FileChanged) {
      return input.changed();
    }
    return input;
  }
}
