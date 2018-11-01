import { IContainer, Token, Registration } from '@ferrymen/fm-ioc-core';

import { AnnotationConfigure } from '.';

const annoBuilderDesc = 'DI_AnnotationBuilder';

/**
 * Annotation class builder.
 *
 */
export interface IAnnotationBuilder<T> {
  /**
   * container.
   *
   */
  container: IContainer;

  /**
   * build token type via config.
   *
   */
  build(
    token: Token<T>,
    config?: AnnotationConfigure<T>,
    data?: any
  ): Promise<T>;

  /**
   * build instance via type config.
   *
   */
  buildByConfig(
    config: Token<T> | AnnotationConfigure<T>,
    data?: any,
    ...excludeTokens: Token<any>[]
  ): Promise<T>;

  /**
   * get finally builder by token and config.
   *
   */
  getBuilder(
    token: Token<T>,
    config?: AnnotationConfigure<T>
  ): IAnnotationBuilder<T>;

  /**
   * get annoation type token.
   *
   */
  getType(config: AnnotationConfigure<T>): Token<T>;

  /**
   * create token instance.
   *
   */
  createInstance(
    token: Token<T>,
    config: AnnotationConfigure<T>,
    data?: any
  ): Promise<T>;

  /**
   * bundle bootstrap instance via config.
   *
   */
  buildStrategy(
    instance: T,
    config: AnnotationConfigure<T>,
    data?: any
  ): Promise<T>;
}

/**
 * any class bootstrap builder
 *
 */
export interface IAnyTypeBuilder extends IAnnotationBuilder<any> {
  /**
   * bootstrap ioc module.
   *
   */
  build<T>(
    token: Token<T>,
    config: AnnotationConfigure<T>,
    data?: any
  ): Promise<T>;
}

/**
 * inject Annotation class builder.
 *
 */
export class InjectAnnotationBuilder<T> extends Registration<
  IAnnotationBuilder<T>
> {
  constructor(type: Token<T>) {
    super(type, annoBuilderDesc);
  }
}

/**
 * Annotation class builder token.
 */
export const AnnotationBuilderToken = new Registration<IAnyTypeBuilder>(
  Object,
  annoBuilderDesc
);

/**
 * Default Annotation class builder token.
 */
export const DefaultAnnotationBuilderToken = new InjectAnnotationBuilder<any>(
  'default'
);
