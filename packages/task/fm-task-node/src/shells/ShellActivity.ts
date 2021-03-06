import {
  ActivityConfigure,
  CtxType,
  Src,
  Task,
  OnActivityInit,
} from '@ferrymen/fm-task-core';

import { ObjectMap, Lang } from '@ferrymen/fm-ioc-core';

import { ExecOptions, exec } from 'child_process';

import { isArray, isBoolean, isString, isNullOrUndefined } from 'util';
import { NodeActivity, NodeActivityContext } from '../core';

/**
 * shell activity config.
 *
 */
export interface ShellActivityConfig extends ActivityConfigure {
  /**
   * shell cmd
   *
   */
  shell: CtxType<Src>;
  /**
   * shell args.
   *
   */
  args?: CtxType<string[] | ObjectMap<any>>;
  /**
   * shell exec options.
   *
   */
  options?: CtxType<ExecOptions>;
  /**
   * allow error or not.
   *
   */
  allowError: CtxType<boolean>;
}

/**
 * Shell Task
 *
 */
@Task('shell')
export class ShellActivity extends NodeActivity implements OnActivityInit {
  /**
   * shell cmd.
   *
   */
  shell: Src;
  /**
   * shell args.
   *
   */
  args: string[];
  /**
   * shell exec options.
   *
   */
  options: ExecOptions;
  /**
   * allow error or not.
   *
   */
  allowError: boolean;

  async onActivityInit(config: ShellActivityConfig) {
    await super.onActivityInit(config);
    this.shell = this.context.to(config.shell);
    let args = this.context.to(config.args);
    this.args = isArray(args) ? args : this.formatArgs(args);
    this.options = this.context.to(config.options);
    this.allowError = this.context.to(config.allowError);
    if (!isBoolean(this.allowError)) {
      this.allowError = true;
    }
  }

  protected async execute(ctx: NodeActivityContext): Promise<void> {
    return await Promise.resolve(this.shell).then(cmds => {
      let options = this.options;
      if (isString(cmds)) {
        return this.execShell(cmds, ctx, options);
      } else if (isArray(cmds)) {
        let pip = Promise.resolve();
        cmds.forEach(cmd => {
          pip = pip.then(() => this.execShell(cmd, ctx, options));
        });
        return pip;
      } else {
        return Promise.reject('shell task config error');
      }
    });
  }

  protected formatShell(shell: string, ctx?: NodeActivityContext): string {
    if (this.args && this.args.length) {
      return shell + ' ' + this.args.join(' ');
    }
    return shell;
  }

  protected formatArgs(args: ObjectMap<any>): string[] {
    let strArgs = [];
    Lang.forIn(args, (val, k: string) => {
      if (k === 'root' || !/^[a-zA-Z]/.test(k)) {
        return;
      }
      if (isArray(val)) {
        strArgs.push(`--${k} ${val.join(',')}`);
      } else if (!isNullOrUndefined(val)) {
        let arg = this.formatArg(val, k, args);
        if (arg) {
          strArgs.push(arg);
        }
      }
    });
    return strArgs;
  }

  protected formatArg(arg: any, key: string, args?: ObjectMap<any>): string {
    if (isBoolean(arg) && arg) {
      return `--${key}`;
    }
    if (!isNullOrUndefined(arg)) {
      return `--${key} ${arg}`;
    }
    return '';
  }

  protected execShell(
    cmd: string,
    ctx: NodeActivityContext,
    options?: ExecOptions
  ): Promise<any> {
    cmd = this.formatShell(cmd, ctx);
    if (!cmd) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      let shell = exec(cmd, options, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });

      shell.stdout.on('data', data => {
        this.checkStdout(data, resolve, reject);
      });

      shell.stderr.on('data', err => {
        this.checkStderr(err, resolve, reject);
      });

      shell.on('exit', code => {
        let msg = `exit child process with code：${code} `;
        console.log(msg);
        if (code > 0) {
          reject(new Error(msg));
        }
      });
    });
  }

  protected checkStderr(
    err: string | Buffer,
    resolve: Function,
    reject: Function
  ) {
    console.error(err);
    if (this.allowError === false) {
      reject(err);
    }
  }

  protected checkStdout(
    data: string | Buffer,
    resolve: Function,
    reject: Function
  ) {
    console.log(data);
  }
}
