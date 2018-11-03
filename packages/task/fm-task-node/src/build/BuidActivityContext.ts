import {
  InjectActivityContextToken,
  InputDataToken,
} from '@ferrymen/fm-task-core';

import { Injectable, Inject } from '@ferrymen/fm-ioc-core';
import { NodeActivityContext, NodeContextToken, INodeContext } from '../core';
import { BuildActivity } from './BuildActivity';

export const BuidActivityContextToken = new InjectActivityContextToken(
  BuildActivity
);

/**
 * build activity context.
 *
 */
@Injectable(BuidActivityContextToken)
export class BuidActivityContext extends NodeActivityContext {
  /**
   * all files input to handle.
   *
   */
  input: string[];
  /**
   * unhandled files.
   *
   */
  public data: string[];
  /**
   * the builder
   *
   */
  builder: BuildActivity;

  constructor(
    @Inject(InputDataToken) input: any,
    @Inject(NodeContextToken) context: INodeContext
  ) {
    super(input, context);
  }

  get execResult(): string[] {
    return this.data;
  }

  /**
   * is completed or not.
   *
   */
  isCompleted(): boolean {
    return !this.execResult || this.execResult.length < 1;
  }

  /**
   * set complete files.
   *
   */
  complete(files: string[]) {
    this.data = this.execResult.filter(f => files.indexOf(f) < 0);
  }
}
