import {
  InjectActivityContextToken,
  InputDataToken,
} from '@ferrymen/fm-task-core';

import { CompilerActivity, ShellCompilerActivity } from './CompilerActivity';

import { Injectable, Inject } from '@ferrymen/fm-ioc-core';

import { BuildActivity } from './BuildActivity';

import { BuildHandleActivity } from './BuildHandleActivity';
import { NodeActivityContext, NodeContextToken, INodeContext } from '../core';

export const CompilerContextToken = new InjectActivityContextToken(
  CompilerActivity
);
export const ShellCompilerContextToken = new InjectActivityContextToken(
  ShellCompilerActivity
);

/**
 * build handle activity context.
 *
 */
@Injectable(CompilerContextToken)
@Injectable(ShellCompilerContextToken)
export class CompilerActivityContext extends NodeActivityContext {
  /**
   * the builder
   *
   */
  builder: BuildActivity;
  handle: BuildHandleActivity;
  input: string[];

  constructor(
    @Inject(InputDataToken) input: any,
    @Inject(NodeContextToken) context: INodeContext
  ) {
    super(input, context);
  }
}
