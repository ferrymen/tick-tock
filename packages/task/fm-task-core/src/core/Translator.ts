import { Registration, Type } from '@ferrymen/fm-ioc-core';

export interface ITranslator {
  /**
   * translate target to.
   *
   */
  translate(target: any): any;
}

/**
 * create translator token.
 *
 */
export class InjectTranslatorToken<T, TR> extends Registration<
  Translator<T, TR>
> {
  constructor(type: Type<T>) {
    super(type, 'Translator');
  }
}
/**
 * base translator.
 *
 */
export abstract class Translator<T, TR> implements ITranslator {
  /**
   * translate target to.
   *
   */
  abstract translate(target: T): TR;
}
