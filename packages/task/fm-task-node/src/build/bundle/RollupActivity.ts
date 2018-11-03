import { ShellActivityConfig } from '../../shells';
import { Src, CtxType, Task } from '@ferrymen/fm-task-core';
import { ObjectMap, Lang } from '@ferrymen/fm-ioc-core';
import { RollupDirOptions, RollupFileOptions, rollup } from 'rollup';
import { ShellCompilerActivity } from '../CompilerActivity';
import { CompilerActivityContext } from '../CompilerActivityContext';
import path from 'path';

export interface RollupCmdOptions {
  format: string;
  file: string;
  dir: string;
}

/**
 * rollup activity config.
 *
 */
export interface RollupActivityConfig extends ShellActivityConfig {
  /**
   * rollup cmd src.
   *
   */
  src: CtxType<Src>;

  /**
   * rollup cmd args options.
   *
   */
  args: CtxType<RollupCmdOptions>;

  /**
   * rollup config file.
   *
   */
  rollupConfig?: CtxType<string>;

  /**
   * rollup dir options.
   *
   */
  rollupDirOptions?: CtxType<RollupDirOptions>;

  /**
   * rollup file options.
   *
   */
  rollupFileOptions?: CtxType<RollupFileOptions>;
}

/**
 * rollup activity.
 *
 */
@Task('rollup')
export class RollupActivity extends ShellCompilerActivity {
  /**
   * rollup src for cmd
   *
   */
  src: string[];
  /**
   * rollup config file.
   *
   */
  rollupConfig: string;
  rollupDirOptions: RollupDirOptions;
  rollupFileOptions: RollupFileOptions;

  async onActivityInit(config: RollupActivityConfig) {
    await super.onActivityInit(config);
    this.src = await this.context.getFiles(this.context.to(config.src));
    this.options = Lang.assign({ silent: true }, this.options || {});
    this.rollupFileOptions = this.context.to(config.rollupFileOptions);
    this.rollupDirOptions = this.context.to(config.rollupDirOptions);
    this.rollupConfig = this.context.to(config.rollupConfig);
    this.shell =
      this.shell ||
      path.normalize(
        path.join(this.context.getRootPath(), 'node_modules', '.bin', 'rollup')
      );
  }

  protected async execute(ctx: CompilerActivityContext): Promise<any> {
    if (this.rollupDirOptions) {
      return await rollup(this.rollupDirOptions);
    }
    if (this.rollupFileOptions) {
      return await rollup(this.rollupFileOptions);
    }
    await super.execute(ctx);
  }

  protected formatShell(shell: string) {
    if (this.rollupConfig) {
      return shell + ' -c ' + this.rollupConfig;
    }
    shell = shell + ' ' + this.src.join(' ');
    return super.formatShell(shell);
  }

  protected formatArgs(env: ObjectMap<any>): string[] {
    let args = Lang.assign(
      {
        format: 'umd',
        file: 'bundle.js',
        dir: 'dist',
      },
      env || {}
    );
    return super.formatArgs(args);
  }
}
