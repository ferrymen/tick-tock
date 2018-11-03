import {
  Src,
  InjectAcitityToken,
  ActivityConfigure,
  ExpressionType,
  Active,
  Task,
  Activity,
  Expression,
  IActivity,
  ActivityContext,
} from '@ferrymen/fm-task-core';
import { Token, Inject, Defer, isArray } from '@ferrymen/fm-ioc-core';
import chokidar from 'chokidar';
import { fromEventPattern } from 'rxjs';
import { bufferTime, map } from 'rxjs/operators';
import { NodeContextToken, INodeContext } from '../core';

/**
 * watch activity token.
 */
export const WatchAcitvityToken = new InjectAcitityToken<WatchActivity>(
  'Watch'
);

/**
 * watch configure.
 *
 */
export interface WatchConfigure extends ActivityConfigure {
  /**
   * transform source.
   *
   */
  src: ExpressionType<Src>;

  /**
   * watch body.
   *
   */
  body?: Active;

  /**
   * watch options.
   *
   */
  options?: ExpressionType<WatchOptions>;
}

/**
 * watch options.
 *
 */
export interface WatchOptions {
  // Performance

  /**
   * persistent (default: true). Indicates whether the process should continue to run as long as files are being watched. If set to false when using fsevents to watch, no more events will be emitted after ready, even if the process continues to run.
   *
   */
  persistent?: boolean;

  // Path filtering

  /**
   *  (anymatch-compatible definition) Defines files/paths to be ignored. The whole relative or absolute path is tested, not just filename. If a function with two arguments is provided, it gets called twice per path - once with a single argument (the path), second time with two arguments (the path and the fs.Stats object of that path).
   *
   */
  ignored?: string;
  /**
   * (default: false). If set to false then add/addDir events are also emitted for matching paths while instantiating the watching as chokidar discovers these file paths (before the ready event).
   *
   */
  ignoreInitial?: boolean;
  /**
   *  (default: true). When false, only the symlinks themselves will be watched for changes instead of following the link references and bubbling events through the link's path.
   *
   */
  followSymlinks?: boolean;
  /**
   * (no default). The base directory from which watch paths are to be derived. Paths emitted with events will be relative to this.
   *
   */
  cwd?: string;
  /**
   * (default: false). If set to true then the strings passed to .watch() and .add() are treated as literal path names, even if they look like globs.
   *
   */
  disableGlobbing?: boolean;

  // Performance

  /**
   * (default: false). Whether to use fs.watchFile (backed by polling), or fs.watch. If polling leads to high CPU utilization, consider setting this to false. It is typically necessary to set this to true to successfully watch files over a network, and it may be necessary to successfully watch files in other non-standard situations. Setting to true explicitly on OS X overrides the useFsEvents default. You may also set the CHOKIDAR_USEPOLLING env variable to true (1) or false (0) in order to override this option.
   *
   */
  usePolling?: boolean;
  /**
   * (default: 100). Interval of file system polling. You may also set the CHOKIDAR_INTERVAL env variable to override this option.
   *
   */
  interval?: number;
  /**
   * (default: 300). Interval of file system polling for binary files. (see list of binary extensions)
   *
   */
  binaryInterval?: number;
  /**
   * (default: true on OS X). Whether to use the fsevents watching interface if available. When set to true explicitly and fsevents is available this supercedes the usePolling setting. When set to false on OS X, usePolling: true becomes the default.
   *
   */
  useFsEvents?: boolean;
  /**
   *  (default: false). If relying upon the fs.Stats object that may get passed with add, addDir, and change events, set this to true to ensure it is provided even in cases where it wasn't already available from the underlying watch events.
   *
   */
  alwaysStat?: boolean;
  /**
   * (default: undefined). If set, limits how many levels of subdirectories will be traversed.
   *
   */
  depth?: number;
  /**
   * awaitWriteFinish (default: false). By default, the add event will fire when a file first appears on disk, before the entire file has been written. Furthermore, in some cases some change events will be emitted while the file is being written. In some cases, especially when watching for large files there will be a need to wait for the write operation to finish before responding to a file creation or modification. Setting awaitWriteFinish to true (or a truthy value) will poll file size, holding its add and change events until the size does not change for a configurable amount of time. The appropriate duration setting is heavily dependent on the OS and hardware. For accurate detection this parameter should be relatively high, making file watching much less responsive. Use with caution.
   *
   */
  awaitWriteFinish:
    | boolean
    | {
        /**
         *  (default: 2000). Amount of time in milliseconds for a file size to remain constant before emitting its event.
         *
         */
        stabilityThreshold?: number;
        /**
         * (default: 100). File size polling interval.
         *
         */
        pollInterval?: number;
      };

  // Errors

  /**
   * (default: false). Indicates whether to watch files that don't have read permissions if possible. If watching fails due to EPERM or EACCES with this set to true, the errors will be suppressed silently.
   *
   */
  ignorePermissionErrors?: boolean;
  /**
   *  (default: true if useFsEvents and usePolling are false). Automatically filters out artifacts that occur when using editors that use "atomic writes" instead of writing directly to the source file. If a file is re-added within 100 ms of being deleted, Chokidar emits a change event rather than unlink then add. If the default of 100 ms does not work well for you, you can override it by setting atomic to a custom value, in milliseconds.
   *
   */
  atomic?: boolean; // or a custom 'atomicity delay', in milliseconds (default 100)
}

export interface IFileChanged {
  added: string[];
  updated: string[];
  removed: string[];
  changed?(): string[];
}

/**
 * files changed.
 *
 */
export class FileChanged implements IFileChanged {
  added: string[];
  updated: string[];
  removed: string[];
  constructor(public watch: Src) {
    this.added = [];
    this.updated = [];
    this.removed = [];
  }

  /**
   * all changed.
   *
   */
  changed(): string[] {
    return this.added.concat(this.updated, this.removed);
  }
}

@Task(WatchAcitvityToken)
export class WatchActivity extends Activity<FileChanged> {
  /**
   * watch src.
   *
   */
  src: Expression<Src>;

  /**
   * watch body.
   *
   */
  body?: IActivity;
  /**
   * watch options.
   *
   */
  options: Expression<WatchOptions>;

  /**
   * default translator token.
   *
   */
  defaultTranslatorToken: Token<any>;

  /**
   * override to node context
   *
   */
  @Inject(NodeContextToken)
  context: INodeContext;

  protected async execute(ctx: ActivityContext): Promise<void> {
    return await this.watch(ctx);
  }

  async onActivityInit(config: WatchConfigure) {
    await super.onActivityInit(config);
    this.src = await this.toExpression(config.src);
    if (config.body) {
      this.body = await this.buildActivity(config.body);
    }
    if (config.options) {
      this.options = await this.toExpression(config.options);
    }
  }

  protected async watch(ctx: ActivityContext) {
    let watchSrc = await this.context.exec(this, this.src, ctx);
    let options = await this.context.exec(this, this.options, ctx);
    let watcher = chokidar.watch(watchSrc, options);
    let watchBody = this.body || ctx.target;

    let defer = new Defer();
    fromEventPattern<IFileChanged>(
      handler => {
        watcher.on('add', paths =>
          handler({ added: isArray(paths) ? paths : [paths] })
        );
        watcher.on('change', paths =>
          handler({ updated: isArray(paths) ? paths : [paths] })
        );
        watcher.on('unlink', paths =>
          handler({ removed: isArray(paths) ? paths : [paths] })
        );
        watcher.on('unlinkDir', paths =>
          handler({ removed: isArray(paths) ? paths : [paths] })
        );
      },
      handler => {
        watcher.close();
      }
    )
      .pipe(
        bufferTime(300),
        map(chgs => {
          let chg = new FileChanged(watchSrc);
          chgs.forEach(fc => {
            if (fc.added) {
              chg.added = chg.added.concat(fc.added);
            }
            if (fc.updated) {
              chg.updated = chg.updated.concat(fc.updated);
            }
            if (fc.removed) {
              chg.removed = chg.removed.concat(fc.removed);
            }
          });
          return chg;
        })
      )
      .subscribe(chg => {
        ctx.setExecResult(chg);
        watchBody.run(ctx);
      });

    defer.promise;
  }
}
