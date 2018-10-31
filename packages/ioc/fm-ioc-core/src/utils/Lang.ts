import { isObject, isFunction, isArray, isClass } from './typeCheck';
import objAssign from 'object-assign';
import { ObjectMap, Type } from '../types';

export namespace Lang {
  /**
   * get object keys
   *
   * @param target
   */
  export function keys(target: any): string[] {
    if (isObject(target)) {
      if (isFunction(Object.keys)) {
        return Object.keys(target);
      } else {
        let keys = [];
        for (let name in target) {
          keys.push(name);
        }
        return keys;
      }
    }
    return [];
  }

  /**
   * values of target object
   *
   * @param target
   */
  export function values(target: any): any[] {
    if (isObject(target)) {
      if (isFunction(Object.values)) {
        return Object.values(target);
      } else {
        let values = [];
        for (let name in target) {
          // Element implicitly has an 'any' type because type '{}' has no index signature
          values.push((target as { [key: string]: any })[name]);
        }
        return values;
      }
    }
    return [];
  }

  export function assign<T, U, V>(
    target: T,
    source1: U,
    source2?: V,
    sources?: any[]
  ): (T & U & V) | (T & U) {
    if (sources && sources.length) {
      sources.unshift(source2 || {});
      sources.unshift(source1 || {});
      return objAssign(target as any, ...sources);
    } else if (source2) {
      return objAssign(target, source1 || ({} as U), source2);
    } else {
      return objAssign(target, source1 || ({} as U));
    }
  }

  /**
   * create an new object from target object omit some field
   *
   * @param target
   * @param fields
   */
  export function omit(target: ObjectMap<any>, ...fields: string[]): any {
    if (isObject(target)) {
      let result: any = {};
      keys(target).forEach(key => {
        if (fields.indexOf(key) < 0) {
          result[key] = (target as { [key: string]: any })[key];
        }
      });
      return result;
    } else {
      return target;
    }
  }

  /**
   * object has field or not
   *
   * @param target
   */
  export function hasField(target: ObjectMap<any>) {
    return keys(target).length > 0;
  }

  /**
   * for in opter for object or array
   *
   * @param target
   * @param iterator
   */
  export function forIn<T>(
    target: ObjectMap<T> | T[],
    iterator: (item: T, idx?: number | string) => void | boolean
  ) {
    if (isArray(target)) {
      target.forEach(iterator);
    } else if (isObject(target)) {
      keys(target).forEach((key, idx) => {
        iterator(target[key], key);
      });
    }
  }

  export function find<T>(
    target: ObjectMap<T> | T[],
    express: (item: T, idx?: number | string) => boolean
  ) {
    let item: T;
    forIn(target, (it, idx) => {
      if (!item) {
        if (express(it, idx)) {
          item = it;
          return false;
        }
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * get target type parent class
   *
   * @param target
   */
  export function getParentClass(target: Type<any>): Type<any> {
    let p = Reflect.getPrototypeOf(target.prototype);
    return isClass(p) ? p : (p.constructor as Type<any>);
  }

  /**
   * @param list
   */
  export function last<T>(list: T[]): T | null {
    if (isArray(list) && list.length) {
      return list[list.length - 1];
    }
    return null;
  }

  /**
   * first.
   *
   */
  export function first<T>(list: T[]): T {
    if (isArray(list) && list.length) {
      return list[0];
    }
    return null;
  }
}
