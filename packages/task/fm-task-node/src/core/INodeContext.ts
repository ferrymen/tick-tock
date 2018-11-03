import { ObjectMap, Express2 } from '@ferrymen/fm-ioc-core';
import { InjectContextToken, IContext, Src } from '@ferrymen/fm-task-core';

export interface CmdOptions {
  force?: boolean;
  silent?: boolean;
}

/**
 * node context token.
 */
export const NodeContextToken = new InjectContextToken<INodeContext>('nodejs');

/**
 * task context.
 *
 */
export interface INodeContext extends IContext {
  /**
   * package file.
   *
   */
  packageFile: string;

  /**
   * has args.
   *
   */
  hasArg(arg): boolean;

  /**
   * get evn args.
   *
   */
  getEnvArgs(): ObjectMap<any>;

  /**
   * get run tasks.
   *
   */
  getRunTasks(): string[];

  /**
   * get root folders.
   *
   */
  getRootFolders(express?: Express2<string, string, boolean>): string[];

  /**
   * get folders in an dir.
   *
   */
  getFolders(
    pathstr: string,
    express?: Express2<string, string, boolean>
  ): string[];

  /**
   * filter fileName in directory.
   *
   */
  getFiles(
    express: Src,
    filter?: (fileName: string) => boolean,
    mapping?: (filename: string) => string
  ): Promise<string[]>;

  /**
   * copy file.
   *
   */
  copyFile(src: Src, dist: string, options?: CmdOptions);

  /**
   * copu dir.
   *
   */
  copyDir(src: Src, dist: string, options?: CmdOptions);

  /**
   * copy file to.
   *
   */
  copyTo(filePath: string, dist: string): Promise<any>;

  /**
   * del files.
   *
   */
  del(src: Src): Promise<any>;

  /**
   * to root path.
   *
   */
  toRootPath(pathstr: string): string;

  /**
   * get package.
   */
  getPackage(): any;

  /**
   * get package version.
   *
   */
  getPackageVersion(): string;

  /**
   * get module version.
   *
   */
  getModuleVersion(name: string, dependencies?: boolean): string;
}
