import { InjectToken, ObjectMap } from '@ferrymen/fm-ioc-core';
import { ModuleConfigure } from '../modules';

/**
 * application configuration token.
 */
export const AppConfigureToken = new InjectToken<AppConfigure>(
  'DI_APP_Configuration'
);

/**
 * application default configuration token.
 */
export const DefaultConfigureToken = new InjectToken<AppConfigure>(
  'DI_Default_Configuration'
);

/**
 * app configuration.
 *
 */
export interface AppConfigure extends ModuleConfigure {
  /**
   * application name.
   *
   */
  name?: string;

  /**
   * app base uri.
   */
  baseURL?: string;

  /**
   * set enable debug log or not.
   *
   */
  debug?: boolean;

  /**
   * log config.
   *
   */
  logConfig?: any;

  /**
   * custom config key value setting.
   *
   */
  setting?: ObjectMap<any>;

  /**
   * custom config connections.
   *
   */
  connections?: ObjectMap<any>;
}

/**
 * app configure loader.
 *
 */
export interface IAppConfigureLoader {
  /**
   * load config.
   *
   */
  load(uri?: string): Promise<AppConfigure>;
}

/**
 *  app configure loader token.
 */
export const AppConfigureLoaderToken = new InjectToken<IAppConfigureLoader>(
  'DI_Configure_Loader'
);

/**
 * configure merger
 *
 */
export interface IConfigureMerger {
  /**
   * merge configuration.
   *
   */
  merge(config: AppConfigure, moduleMetadata: ModuleConfigure): AppConfigure;
}
