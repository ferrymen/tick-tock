import {
  ActivityConfigure,
  CtxType,
  Src,
  Task,
  Activity,
  ActivityContext,
} from '@ferrymen/fm-task-core';

import { Inject } from '@ferrymen/fm-ioc-core';

import { isBoolean, isString, isArray } from 'util';

import { existsSync } from 'fs';
import execa from 'execa';
import { INodeContext, NodeContextToken } from '../core';

/**
 * shell task config.
 *
 */
export interface ExecFileActivityConfig extends ActivityConfigure {
  /**
   * files
   *
   */
  files: CtxType<Src>;
  /**
   * shell args.
   *
   */
  args?: CtxType<string[]>;
  /**
   * shell exec options.
   *
   */
  options?: CtxType<execa.Options>;
  /**
   * allow error or not.
   *
   */
  allowError: CtxType<boolean>;
}

/**
 * exec file Task
 *
 */
@Task('execfile')
export class ExecFileActivity extends Activity<any> {
  files: Src;
  args?: string[];
  options?: execa.Options;
  allowError = true;

  @Inject(NodeContextToken)
  context: INodeContext;

  async onActivityInit(config: ExecFileActivityConfig) {
    await super.onActivityInit(config);
    this.files = this.context.to(config.files);
    this.args = this.context.to(config.args);
    this.options = this.context.to(config.options);
    this.allowError = this.context.to(config.allowError);
    if (!isBoolean(this.allowError)) {
      this.allowError = true;
    }
  }

  protected async execute(ctx?: ActivityContext): Promise<void> {
    return await Promise.resolve(this.files).then(files => {
      let allowError = this.allowError;
      let options = this.options;
      let args = this.args;
      if (isString(files)) {
        return this.execFile(files, args, options, allowError !== false);
      } else if (isArray(files)) {
        let pip = Promise.resolve();
        files.forEach(file => {
          pip = pip.then(() =>
            this.execFile(file, args, options, allowError !== false)
          );
        });
        return pip;
      } else {
        return Promise.reject(new Error('exec file task config error'));
      }
    });
  }

  protected execFile(
    file: string,
    args?: string[],
    options?: execa.Options,
    allowError = true
  ): Promise<any> {
    if (!file && !existsSync(file)) {
      return Promise.resolve();
    }
    return execa(file, args, options);
  }
}
