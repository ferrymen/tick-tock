type configures =
  | CoreActivityConfigs
  | AssetConfigure
  | IPipeConfigure
  | TsConfigure
  | DestConfigure
  | SourceConfigure
  | TestConfigure
  | UglifyConfigure
  | WatchConfigure
  | AnnotationsConfigure
  | CleanConfigure
  | ShellActivityConfig
  | ExecFileActivityConfig
  | PackageConfigure;

export type PipesConfigure = configures | GCoreActivityConfigs<configures>;

export type PipesActivityType<T extends IActivity> = Token<T> | PipesConfigure;

/**
 * package configure.
 *
 */
export interface PackageConfigure extends ActivityConfigure {
  /**
   * src root path.
   *
   */
  src?: CtxType<string>;

  /**
   * clean task config.
   *
   */
  clean?: ExpressionToken<Src> | ConfigureType<CleanActivity, CleanConfigure>;
  /**
   * assets.
   *
   */
  assets?: ObjectMap<
    ExpressionToken<Src> | ConfigureType<IActivity, PipesConfigure>
  >;

  /**
   * test config.
   *
   */
  test?: ExpressionToken<Src> | ConfigureType<TestActivity, TestConfigure>;

  /**
   * dest.
   *
   */
  dest?: ExpressionToken<string> | ConfigureType<DestActivity, DestConfigure>;

  /**
   * package sequence activity.
   *
   */
  sequence?: PipesActivityType<IActivity>[];
}

/**
 * package activity.
 *
 */
export interface IPackageActivity extends IActivity {}

/**
 * inject package token.
 *
 */
export class InjectPackageToken<
  T extends IPackageActivity
> extends Registration<T> {
  constructor(desc: string) {
    super('PackageActivity', desc);
  }
}

/**
 * package token
 */
export const PackageToken = new InjectPackageToken<IPackageActivity>('');

/**
 * package builder token.
 */
export const PackageBuilderToken = new InjectAcitityBuilderToken<
  IPackageActivity
>(PackageToken);
