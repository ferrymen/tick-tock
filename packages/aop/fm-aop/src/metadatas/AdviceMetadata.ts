import { Type, MethodMetadata } from '@ferrymen/fm-ioc-core';

export interface AdviceMetadata extends MethodMetadata {
  /**
   * path or module name, match express
   * execution(moduelName.*.*(..)")
   * match method with a decorator annotation.
   * @annotation(DecoratorName)
   */
  pointcut: string | RegExp;

  /**
   * method with specail decortor.
   *
   */
  annotation?: Function | string;

  /**
   * math only the object.
   *
   */
  target?: any;

  /**
   * advice within.
   *
   */
  within?: Type<any> | Type<any>[];

  /**
   * annotation name, special annotation metadata for annotation advices.
   *
   */
  annotationName?: string;

  /**
   * set name provider of annotation metadata for annotation advices.
   *
   */
  annotationArgName?: string;

  /**
   * advice type name.
   * eg. `Before`, `Pointcut`, `Around`, `After`, `AfterThrowing`, `AfterReturning`
   *
   */
  adviceName?: string;
}
