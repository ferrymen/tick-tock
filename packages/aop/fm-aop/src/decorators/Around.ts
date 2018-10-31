import { AroundMetadata } from '../metadatas';
import { IAdviceDecorator, createAdviceDecorator } from './Advice';
import { isString } from '@ferrymen/fm-ioc-core';

/**
 * aop around decorator.
 *
 */
export interface IAroundDecorator<T extends AroundMetadata>
  extends IAdviceDecorator<T> {
  /**
   * define aop around advice.
   *
   */
  (
    pointcut?: string | RegExp,
    args?: string,
    returning?: string,
    throwing?: string,
    annotation?: string
  ): MethodDecorator;
}

/**
 * aop Around advice decorator.
 *
 * @Around
 */
export const Around: IAroundDecorator<AroundMetadata> = createAdviceDecorator<
  AroundMetadata
>('Around', null, args => {
  args.next<AroundMetadata>({
    match: arg => isString(arg),
    setMetadata: (metadata, arg) => {
      metadata.args = arg;
    },
  });

  args.next<AroundMetadata>({
    match: arg => isString(arg),
    setMetadata: (metadata, arg) => {
      metadata.returning = arg;
    },
  });

  args.next<AroundMetadata>({
    match: arg => isString(arg),
    setMetadata: (metadata, arg) => {
      metadata.throwing = arg;
    },
  });
}) as IAroundDecorator<AroundMetadata>;
