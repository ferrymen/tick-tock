import {
  ClassMetadata,
  Type,
  ITypeDecorator,
  createClassDecorator,
} from '@ferrymen/fm-ioc-core';

export interface INonePointcutDecorator extends ITypeDecorator<ClassMetadata> {
  /**
   * NonePointcut decorator, define class not work with aop.
   *
   * @NonePointcut
   *
   */
  (): ClassDecorator;
  /**
   * NonePointcut decorator, define class not work with aop.
   *
   * @NonePointcut
   */
  (target: Type<any>): void;
}

/**
 * NonePointcut decorator, define class not work with aop.
 *
 * @NonePointcut
 */
export const NonePointcut: INonePointcutDecorator = createClassDecorator<
  ClassMetadata
>('NonePointcut');
