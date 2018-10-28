import { InjectToken } from '../InjectToken';
import { Type, Token } from '../types';
import { IContainer } from '../IContainer';
import { Registration } from '../Registration';
import { IAnnotationMetadata, IMetaAccessor } from './IMetaAccessor';

/**
 * Module Validate Token
 */
export const ModuleValidateToken = new InjectToken<IModuleValidate>(
  'DI_ModuleValidate'
);

/**
 * module validate.
 *
 */
export interface IModuleValidate {
  /**
   * is right module or not.
   *
   */
  validate(type: Type<any>): boolean;

  /**
   * get module metadata config.
   *
   */
  getMetaConfig(
    token: Token<any>,
    container: IContainer
  ): IAnnotationMetadata<any>;

  /**
   * get meta accessor.
   *
   */
  getMetaAccessor(container: IContainer): IMetaAccessor<any>;
  /**
   * decorator of the module.
   *
   */
  getDecorator(): string | string[];
}

/**
 * inject module validate token.
 *
 */
export class InjectModuleValidateToken<
  T extends IModuleValidate
> extends Registration<T> {
  constructor(desc: string) {
    super('DI_ModuleValidate', desc);
  }
}
