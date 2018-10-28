import { Type, Token, Providers, Express2 } from '../../types';
import { IContainer } from '../../IContainer';
import { isUndefined, isObject, isFunction } from '../../utils';

export interface TypeProvider extends Type<any> {}

export interface IProvider {
  /**
   * this type provider to.
   *
   * @type {SymbolType<any>}
   * @memberof Provider
   */
  provide: Token<any>;
}

/**
 * @usageNotes
 * ```
 * @Injectable()
 * class MyService {}
 *
 * const provider: ClassProvider = {provide: 'someToken', useClass: MyService};
 * ```
 *
 * @description
 * Configures the `Injector` to return an instance of `useClass` for a token.
 *
 */
export interface ClassProvider extends IProvider {
  useClass: Type<any>;
  /**
   * A list of `token`s which need to be resolved by the injector. The list of values is then
   * used as arguments to the `useFactory` function.
   */
  deps?: any[];
}

export interface ValueProvider extends IProvider {
  useValue: any;
}

/**
 * @usageNotes
 * ```
 * function serviceFactory() { ... }
 *
 * const provider: FactoryProvider = {provide: 'someToken', useFactory: serviceFactory, deps: []};
 * ```
 *
 *
 *
 */
export interface FactoryProvider extends IProvider {
  /**
   * A function to invoke to create a value for this `token`. The function is invoked with
   * resolved values of `token`s in the `deps` field.
   */
  useFactory: Function;

  /**
   * A list of `token`s which need to be resolved by the injector. The list of values is then
   * used as arguments to the `useFactory` function.
   */
  deps?: any[];
}

export interface ExistingProvider extends IProvider {
  useExisting: Token<any>;
}

export type ProviderType =
  | TypeProvider
  | ValueProvider
  | ClassProvider
  | ExistingProvider
  | FactoryProvider
  | Provider;

/**
 *  provider, to dynamic resovle instance of params in run time.
 *
 */
export class Provider {
  /**
   * service provider is value or value factory.
   *
   */
  protected value?: any;
  /**
   * service is instance of type.
   *
   */
  type?: Token<any>;

  constructor(type?: Token<any>, value?: any) {
    this.type = type;
    this.value = value;
  }

  /**
   * resolve provider value.
   *
   */
  resolve<T>(container: IContainer, ...providers: Providers[]): T {
    if (isUndefined(this.value)) {
      // Type 'undefined' is not assignable to type 'Token<any>'
      return container.has(this.type as Token<any>)
        ? container.resolve(this.type as Token<any>, ...providers)
        : null;
    } else {
      return this.value; // isFunction(this.value) ? this.value(container) : this.value;
    }
  }

  /**
   * create provider.
   *
   */
  static create(type: Token<any>, value: any): Provider {
    return new Provider(type, value);
  }

  /**
   * create extends provider.
   *
   */
  static createExtends(
    token: Token<any>,
    value: any,
    extendsTarget?: Express2<any, ExtendsProvider, void>
  ): ExtendsProvider {
    return new ExtendsProvider(token, value, extendsTarget);
  }

  /**
   * create custom provider.
   *
   */
  // static createCustom(type?: Token<any>, toInstance?: ToInstance<any>, value?: any): CustomProvider {
  //     return new CustomProvider(type, toInstance, value);
  // }

  /**
   * create invoked provider.
   *
   */
  static createInvoke(
    token: Token<any>,
    method: string,
    value?: any
  ): InvokeProvider {
    return new InvokeProvider(token, method, value);
  }

  /**
   * create param provider.
   *
   */
  static createParam(
    token: Token<any>,
    value: any,
    index?: number,
    method?: string
  ): ParamProvider {
    return new ParamProvider(token, value, index, method);
  }

  /**
   * create async param provider.
   *
   */
  // static createAsyncParam(files: string | string[], token: Token<any>, index?: number, method?: string, value?: any): AsyncParamProvider {
  //     return new AsyncParamProvider(files, token, index, method, value)
  // }
}

/**
 * InvokeProvider
 *
 */
export class InvokeProvider extends Provider {
  /**
   * service value is the result of type instance invoke the method return value.
   *
   */
  protected method?: string;

  constructor(type?: Token<any>, method?: string, value?: any) {
    super(type, value);
    this.method = method;
  }

  resolve<T>(container: IContainer, ...providers: Providers[]): T {
    if (this.method) {
      return container.syncInvoke<T>(
        this.type as Token<any>,
        this.method,
        ...providers
      );
    }
    return super.resolve(container, ...providers);
  }
}

/**
 * param provider.
 *
 */
export class ParamProvider extends InvokeProvider {
  /**
   * param index, param name.
   *
   */
  index?: number;

  constructor(
    token?: Token<any>,
    value?: any,
    index?: number,
    method?: string
  ) {
    super(token, method, value);
    this.index = index;
  }

  resolve<T>(container: IContainer, ...providers: Providers[]): T {
    return super.resolve(container, ...providers);
  }
}

/**
 * Provider enable exntends target with provider in dynamic.
 *
 */
export class ExtendsProvider extends Provider {
  constructor(
    token: Token<any>,
    value?: any,
    private extendsTarget?: Express2<any, ExtendsProvider, void>
  ) {
    super(token, value);
  }

  resolve<T>(container: IContainer, ...providers: Providers[]): T {
    return super.resolve(container, ...providers);
  }

  extends(target: any) {
    if (isObject(target) && isFunction(this.extendsTarget)) {
      this.extendsTarget(target, this);
    }
  }
}
