import { SymbolType, Token, Type, AbstractType } from './types';
import { isClass, isFunction, getClassName } from './utils';

/**
 * inject token
 */
export class Registration<T> {
  protected type = 'Reg';
  protected classType: SymbolType<any>;
  protected desc: string;

  /**
   * Creates an instance of Registration
   *
   * @param provideType
   * @param desc
   */
  constructor(provideType: Token<T> | Token<any>, desc: string) {
    if (provideType instanceof Registration) {
      this.classType = provideType.getProvide();
      let pdec = provideType.getDesc();
      if (pdec && desc && pdec !== desc) {
        this.desc = pdec + '_' + desc;
      } else {
        this.desc = desc;
      }
    } else {
      this.classType = provideType;
      this.desc = desc;
    }
  }

  getProvide(): SymbolType<any> {
    return this.classType;
  }

  getClass(): Type<T> | AbstractType<T> | null {
    if (isClass(this.classType)) {
      return this.classType;
    }
    return null;
  }

  getDesc() {
    return this.desc;
  }

  toString(): string {
    let name = '';
    if (isFunction(this.classType)) {
      name = `{${getClassName(this.classType)}}`;
    } else if (this.classType) {
      name = this.classType.toString();
    }
    return `${this.type} ${name} ${this.desc}`.trim();
  }
}
