import { AbstractType, Type, Token } from '../types';
import { Registration } from '../Registration';
import { Lang } from './Lang';

/**
 * check target is function or not
 *
 * @param target
 */
export function isFunction(target: any): target is Function {
  if (!target) {
    return false;
  }
  return typeof target === 'function';
}

/**
 * check Abstract class with @Abstract or not
 *
 * @param target
 */
export function isAbstractDecoratorClass(
  target: any
): target is AbstractType<any> {
  if (!isFunction(target)) {
    return false;
  }

  /**
   * reflect-metadata
   */
  if (Reflect.hasOwnMetadata('@Abstract', target)) {
    return true;
  }

  return false;
}

/**
 * get class name
 * @param classType
 */
export function getClassName(classType: AbstractType<any>): string {
  if (!isFunction(classType)) {
    return '';
  }
  if (/^[a-z]$/.test(classType.name)) {
    return classType.classAnnations
      ? classType.classAnnations.name
      : classType.name;
  }

  return classType.name;
}

/**
 * check target is class or not
 * @param target
 */
export function isClass(target: any): target is Type<any> {
  if (!isFunction(target)) {
    return false;
  }

  if (target.prototype) {
    if (!target.name || target.name === 'Object') {
      return false;
    }

    if (Reflect.hasOwnMetadata('@Abstract', target)) {
      return false;
    }

    let type = target as Type<any>;

    // for uglify
    if (/^[a-z]$/.test(type.name)) {
      if (type.classAnnations && type.classAnnations.name) {
        return true;
      } else {
        return false;
      }
    } else {
      if (type.classAnnations && isString(type.classAnnations.name)) {
        return true;
      }

      if (!/^[A-Z@]/.test(target.name)) {
        return false;
      }
    }

    // for IE 8, 9
    if (!isNodejsEnv() && /MSIE [6-9]/.test(navigator.userAgent)) {
      return true;
    }
    try {
      target.arguments && target.caller;
      return false;
    } catch (e) {
      return true;
    }
  }

  return false;
}

/**
 * is run in nodejs or not
 */
export function isNodejsEnv(): boolean {
  return (
    typeof process !== 'undefined' &&
    typeof process.versions.node !== 'undefined'
  );
}

/**
 * check target is token or not.
 *
 * @param target
 */
export function isToken(target: any): target is Token<any> {
  if (!target) {
    return false;
  }
  if (
    isString(target) ||
    isSymbol(target) ||
    isClass(target) ||
    (isObject(target) && target instanceof Registration)
  ) {
    return true;
  }
  return false;
}

/**
 * is target promise or not
 *
 * @param target
 */
export function isPromise(target: any): target is Promise<any> {
  if (!target) {
    return false;
  }
  if (isFunction(target.then) && isFunction(target.catch)) {
    return true;
  }
  return false;
}

/**
 * is target rxjs observable or not
 *
 * @param target
 */
export function isObservable(target: any): boolean {
  if (!target && !isObject(target)) {
    return false;
  }
  if (isFunction(target.subscribe) && isFunction(target.toPromise)) {
    return true;
  }
  return false;
}

/**
 * is target base object or not
 *
 * @param target
 */
export function isBaseObject(target: any): target is object {
  if (!target) {
    return false;
  }
  if (target.constructor && target.constructor.name === 'Object') {
    return true;
  }
  return false;
}

/**
 * is metadata object or not
 *
 * @param target
 * @param props
 * @param extendsProps
 */
export function isMetadataObject(
  target: any,
  props?: string[],
  extendsProps?: string[]
): boolean {
  if (!target) {
    return false;
  }
  if (
    isBaseType(target) ||
    isSymbol(target) ||
    target instanceof Registration ||
    target instanceof RegExp ||
    target instanceof Date
  ) {
    return false;
  }

  if (target.constructor && target.constructor.name !== 'Object') {
    return false;
  }

  props = props || [];
  if (extendsProps) {
    props = extendsProps.concat(props);
  }

  if (props.length) {
    // TS2532: Object is possibly 'undefined'
    return Lang.keys(target).some(n => (props as string[]).indexOf(n) > 0);
  }

  return true;
}

/**
 * check object is class metadata or not
 *
 * @param target
 * @param extendsProps
 */
export function isClassMetadata(target: any, extendsProps?: string[]): boolean {
  return isMetadataObject(
    target,
    ['singleton', 'provide', 'alias', 'type'],
    extendsProps
  );
}

/**
 * check object is param metadata or not
 *
 * @param target
 * @param extendsProps
 */
export function isParamMetadata(target: any, extendsProps?: string[]): boolean {
  return isMetadataObject(target, ['type', 'provider', 'index'], extendsProps);
}

/**
 * check object is param prop metadata or not
 *
 * @param target
 * @param extendsProps
 */
export function isParamPropMetadata(
  target: any,
  extendsProps?: string[]
): boolean {
  return isMetadataObject(target, ['type', 'provider', 'index'], extendsProps);
}

/**
 * check object is property metadata or not
 *
 * @param target
 * @param extendsProps
 */
export function isPropertyMetadata(
  target: any,
  extendsProps?: string[]
): boolean {
  return isMetadataObject(target, ['type', 'provider'], extendsProps);
}

export function isString(target: any): target is string {
  return typeof target === 'string';
}

export function isBoolean(target: any): target is boolean {
  return typeof target === 'boolean' || (target === true || target === false);
}

export function isNumber(target: any): target is number {
  return typeof target === 'number';
}

export function isUndefined(target: any): target is undefined {
  return typeof target === 'undefined' || target === undefined;
}

export function isNull(target: any): target is null {
  return target === null;
}

export function isNullOrUndefined(target: any): boolean {
  return isNull(target) || isUndefined(target);
}

export function isArray(target: any): target is Array<any> {
  return Array.isArray(target);
}

export function isObject(target: any): target is object {
  var type = typeof target;
  return target != null && (type === 'object' || type === 'function');
}

export function isDate(target: any): target is Date {
  return isObject(target) && target instanceof Date;
}

export function isSymbol(target: any): target is Symbol {
  return (
    typeof target === 'symbol' ||
    (isObject(target) && /^Symbol\(/.test(target.toString()))
  );
}

export function isRegExp(target: any): target is RegExp {
  return target && target instanceof RegExp;
}

export function isBaseType(target: any): boolean {
  return (
    isBoolean(target) || isString(target) || isNumber(target) || isDate(target)
  );
}
