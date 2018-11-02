import {
  IExports,
  Token,
  IContainer,
  Type,
  Registration,
} from '@ferrymen/fm-ioc-core';
import { ModuleConfig } from '.';

/**
 * injected module.
 *
 */
export class InjectedModule<T> implements IExports {
  constructor(
    public token: Token<T>,
    public config: ModuleConfig<T>,
    public container: IContainer,
    public type?: Type<any>,
    public exports?: Token<any>[],
    public providers?: Token<any>[]
  ) {}
}

/**
 * Injected Module Token.
 *
 */
export class InjectedModuleToken<T> extends Registration<InjectedModule<T>> {
  constructor(type: Type<T>) {
    super(type, 'InjectedModule');
  }
}
