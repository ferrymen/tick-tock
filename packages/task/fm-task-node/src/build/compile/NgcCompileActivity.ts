import { CtxType, Task } from '@ferrymen/fm-task-core';
import { ShellActivityConfig } from '../../shells';
import { ShellCompilerActivity } from '../CompilerActivity';
import { Lang } from '@ferrymen/fm-ioc-core';
import path from 'path';

export interface AngularConfig {
  defaultProject?: string;
}

/**
 * ngc builder activity config.
 *
 */
export interface NgcCompileActivityConfig extends ShellActivityConfig {
  /**
   * tsconfig.
   *
   */
  tsconfig?: CtxType<string>;
}

/**
 * ngc compile activity.
 *
 */
@Task('ngc')
export class NgcCompileActivity extends ShellCompilerActivity {
  /**
   * tsconfig.
   *
   */
  tsconfig: string;

  /**
   * project root.
   *
   */
  projectRoot: string;

  async onActivityInit(config: NgcCompileActivityConfig) {
    await super.onActivityInit(config);
    this.options = Lang.assign({ silent: true }, this.options || {});
    this.tsconfig = this.context.to(config.tsconfig);
    this.shell =
      this.shell ||
      path.join(this.context.getRootPath(), 'node_modules', '.bin', 'ngc');
  }

  protected formatShell(shell: string): string {
    shell = shell + ' -p ' + this.tsconfig;
    return super.formatShell(shell);
  }

  protected checkStderr(err, resolve: Function, reject: Function) {
    super.checkStderr(err, resolve, reject);
    if (err.includes('Compilation complete.')) {
      resolve();
    }
  }
}
