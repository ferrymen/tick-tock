import { AnnotationConfigure } from './AnnotationConfigure';

/**
 * on Annotation class create hook.
 *
 */
export interface BeforeAnnotationInit<T> {
  /**
   * before annotation class init.
   *
   */
  anBeforeInit(config?: AnnotationConfigure<T>): void | Promise<any>;
}

/**
 * After Annotation classp created hook.
 *
 */
export interface AfterAnnotationInit<T> {
  /**
   * after annotation class init.
   *
   */
  anAfterInit(config?: AnnotationConfigure<T>): void | Promise<any>;
}

/**
 * boot instance.
 */
export type AnnoInstance<T> = T &
  BeforeAnnotationInit<T> &
  AfterAnnotationInit<T>;
