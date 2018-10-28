import { Registration } from './Registration';

/**
 * inject token.
 *
 */
export class InjectToken<T> extends Registration<T> {
  constructor(desc: string | symbol) {
    super(desc, '');
  }
}
