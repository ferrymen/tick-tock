import { InjectToken, Singleton } from '@ferrymen/fm-ioc-core';

/**
 * uuid factory.
 *
 */
export interface UUIDFactory {
  /**
   * generate uuid.
   *
   */
  generate(): string;
}

/**
 * uuid factory token.
 */
export const UUIDToken = new InjectToken<UUIDFactory>('uuid_factory');

/**
 * random uuid factory.
 *
 */
@Singleton(UUIDToken)
export class RandomUUIDFactory implements UUIDFactory {
  constructor() {}
  /**
   * generate uuid.
   *
   */
  generate(): string {
    return (
      this.randomS4() +
      this.randomS4() +
      '-' +
      this.randomS4() +
      '-' +
      this.randomS4() +
      '-' +
      this.randomS4() +
      '-' +
      this.randomS4() +
      this.randomS4() +
      this.randomS4()
    );
  }

  protected randomS4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
