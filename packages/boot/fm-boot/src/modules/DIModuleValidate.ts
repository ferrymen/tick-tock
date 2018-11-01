import {
  IModuleValidate,
  InjectModuleValidateToken,
  Singleton,
  BaseModuelValidate,
} from '@ferrymen/fm-ioc-core';
import { DIModule } from '../decorators';

/**
 * DIModuel Validate Token
 */
export const DIModuelValidateToken = new InjectModuleValidateToken<
  IModuleValidate
>(DIModule.toString());

/**
 * DIModuel Validate
 *
 */
@Singleton(DIModuelValidateToken)
export class DIModuelValidate extends BaseModuelValidate {
  getDecorator() {
    return DIModule.toString();
  }
}
