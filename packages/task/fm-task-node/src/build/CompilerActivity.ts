import { Task } from '@ferrymen/fm-task-core';

import { ExecOptions } from 'child_process';
import { NodeActivity } from '../core';
import { ShellActivity } from '../shells';
import { CompilerActivityContext } from './CompilerActivityContext';

/**
 * compiler activity.
 *
 */
export abstract class CompilerActivity extends NodeActivity {
  /**
   * execute build activity.
   *
   */
  protected abstract async execute(ctx: CompilerActivityContext): Promise<void>;
}

/**
 * shell compiler activity.
 *
 */
@Task
export class ShellCompilerActivity extends ShellActivity {
  protected async execute(ctx: CompilerActivityContext): Promise<void> {
    await super.execute(ctx);
  }

  protected execShell(
    cmd: string,
    ctx: CompilerActivityContext,
    options?: ExecOptions
  ): Promise<any> {
    return super.execShell(cmd, ctx, options);
  }

  protected formatShell(shell: string, ctx?: CompilerActivityContext): string {
    return super.formatShell(shell, ctx);
  }
}
