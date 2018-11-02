import { Providers, Token, LoadType, Modules } from '@ferrymen/fm-ioc-core';
import { AnnotationConfigure } from '../annotations';
import { IModuleBuilder } from './IModuleBuilder';

/**
 * module configuration.
 *
 */
export interface ModuleConfig<T> extends AnnotationConfigure<T> {
  /**
   * module name.
   *
   */
  name?: string;

  /**
   * providers
   *
   */
  providers?: Providers[];

  /**
   * module bootstrap token.
   *
   */
  bootstrap?: Token<T>;

  /**
   * imports dependens modules
   *
   */
  imports?: LoadType[];
  /**
   * exports modules
   *
   */
  exports?: Modules[];

  /**
   * DI module Loader builder
   *
   */
  builder?: Token<IModuleBuilder<any>> | IModuleBuilder<any>;
}

/**
 * module configure, with any bootstrap.
 *
 */
export interface ModuleConfigure extends ModuleConfig<any> {}
