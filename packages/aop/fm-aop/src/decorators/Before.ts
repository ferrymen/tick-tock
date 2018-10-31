import { IAdviceDecorator, createAdviceDecorator } from '.';

import { AdviceMetadata } from '..';

/**
 * aop Before advice decorator.
 *
 * @Before
 */
export const Before: IAdviceDecorator<AdviceMetadata> = createAdviceDecorator<
  AdviceMetadata
>('Before') as IAdviceDecorator<AdviceMetadata>;
