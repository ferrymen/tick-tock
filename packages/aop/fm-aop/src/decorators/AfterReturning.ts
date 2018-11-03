import { AfterReturningMetadata } from '../metadatas';
import { createAdviceDecorator, IAdviceDecorator } from './Advice';
import { isString } from '@ferrymen/fm-ioc-core';

/**
 * aop after returning decorator.
 *
 */
export interface IAfterReturningDecorator<T extends AfterReturningMetadata>
  extends IAdviceDecorator<T> {
  /**
   * define aop after returning advice.
   *
   */
  (
    pointcut?: string | RegExp,
    returning?: string,
    annotation?: string
  ): MethodDecorator;
}

/**
 * aop after returning advice decorator.
 *
 * @AfterReturning
 */
export const AfterReturning: IAfterReturningDecorator<
  AfterReturningMetadata
> = createAdviceDecorator<AfterReturningMetadata>(
  'AfterReturning',
  null,
  args => {
    args.next<AfterReturningMetadata>({
      match: arg => isString(arg),
      setMetadata: (metadata, arg) => {
        metadata.returning = arg;
      },
    });
  }
) as IAfterReturningDecorator<AfterReturningMetadata>;
