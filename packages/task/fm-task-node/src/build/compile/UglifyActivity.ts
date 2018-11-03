import { CtxType, Src, Task } from '@ferrymen/fm-task-core';

import { ObjectMap, Lang } from '@ferrymen/fm-ioc-core';
import { ShellActivityConfig } from '../../shells';
import { ShellCompilerActivity } from '../CompilerActivity';
import path from 'path';

/**
 * uglify activity config.
 *
 */
export interface UglifyActivityConfig extends ShellActivityConfig {
  /**
   * ts file source.
   *
   */
  src?: CtxType<Src>;

  /**
   * ts compile out dir.
   *
   */
  dist?: CtxType<string>;

  /**
   * bundle name.
   *
   */
  bundle?: CtxType<string>;

  /**
   * uglify options.
   *
   */
  uglifyOptions?: CtxType<ObjectMap<any>>;
}

/**
 * uglify activity.
 *
 */
@Task('uglify')
export class UglifyActivity extends ShellCompilerActivity {
  /**
   * src
   *
   */
  src: Src;
  /**
   * output dist.
   *
   */
  dist: string;
  /**
   * bundle file name.
   *
   */
  bundle: string;

  /**
   * uglify options.
   *
   */
  uglifyOptions: ObjectMap<any>;

  async onActivityInit(config: UglifyActivityConfig) {
    await super.onActivityInit(config);
    this.options = Lang.assign({ silent: true }, this.options || {});
    this.src = await this.context.getFiles(this.context.to(config.src));
    this.dist = this.context.to(config.dist);
    this.uglifyOptions = this.context.to(config.uglifyOptions);
    this.bundle = this.context.to(config.bundle) || 'bundle.js';
    this.shell =
      this.shell ||
      path.normalize(
        path.join(
          this.context.getRootPath(),
          'node_modules',
          '.bin',
          'uglifyjs'
        )
      );
  }

  protected formatShell(shell: string) {
    let outfile = path.join(this.dist, this.bundle);
    shell = shell + ' ' + outfile + ' -o ' + outfile;
    return super.formatShell(shell);
  }

  protected formatArgs(env: ObjectMap<any>): string[] {
    let args = Lang.assign(
      {
        compress: true,
        mangle: true,
        toplevel: true,
        verbose: true,
      },
      env || {},
      this.uglifyOptions
    );
    return super.formatArgs(args);
  }
}
