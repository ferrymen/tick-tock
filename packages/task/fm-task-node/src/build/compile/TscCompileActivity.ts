import { CtxType, Src, Task } from '@ferrymen/fm-task-core';

import { ObjectMap, isArray, Lang, isBoolean } from '@ferrymen/fm-ioc-core';
import { ShellActivityConfig } from '../../shells';
import { ShellCompilerActivity } from '../CompilerActivity';
import path from 'path';
import {
  CompilerOptions,
  ModuleResolutionKind,
  ModuleKind,
  ScriptTarget,
} from 'typescript';

/**
 * tsc builder activity config
 *
 */
export interface TscCompileActivityConfig extends ShellActivityConfig {
  /**
   * tsconfig.
   *
   */
  tsconfig?: CtxType<string>;

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
   * compiler options.
   *
   */
  compilerOptions?: CtxType<CompilerOptions>;
}

/**
 * typescript compiler activity.
 *
 */
@Task('tsc')
export class TscCompileActivity extends ShellCompilerActivity {
  /**
   * tsconfig.
   *
   */
  tsconfig: string;
  /**
   * ts file src
   *
   */
  src: Src;
  /**
   * out put dist.
   *
   */
  dist: string;
  compilerOptions?: CompilerOptions;

  async onActivityInit(config: TscCompileActivityConfig) {
    await super.onActivityInit(config);
    this.src = await this.context.getFiles(this.context.to(config.src));
    this.dist = this.context.to(config.dist);
    this.tsconfig = this.context.to(config.tsconfig);
    this.compilerOptions = this.context.to(config.compilerOptions);
    this.shell =
      this.shell || path.normalize(path.resolve('node_modules', '.bin', 'tsc'));
  }

  protected formatShell(shell: string): string {
    if (this.tsconfig) {
      return shell + ' -p ' + this.tsconfig;
    }
    shell = `${shell} ${isArray(this.src) ? this.src.join(' ') : this.src}`;
    return super.formatShell(shell);
  }

  protected formatArgs(env: ObjectMap<any>): string[] {
    let args = Lang.assign(
      <CompilerOptions>{
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES5,
        sourceMap: true,
        lib: ['dom', 'es2017'],
        typeRoots: ['node'],
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        outDir: this.dist,
        moduleResolution: ModuleResolutionKind.NodeJs,
      },
      env || {},
      this.compilerOptions || {}
    );
    return super.formatArgs(args);
  }

  protected formatArg(arg: any, key: string, env?: ObjectMap<any>): any {
    if (isBoolean(arg) && arg) {
      return `--${key} true`;
    }
    switch (key) {
      case 'target':
        return `--${key} ${ScriptTarget[arg].toLowerCase()}`;
      case 'module':
        return `--${key} ${ModuleKind[arg].toLowerCase()}`;
      case 'moduleResolution':
        return `--${key} ${
          arg === ModuleResolutionKind.NodeJs ? 'node' : 'class'
        }`;
      default:
        return super.formatArg(arg, key, env);
    }
  }
}
