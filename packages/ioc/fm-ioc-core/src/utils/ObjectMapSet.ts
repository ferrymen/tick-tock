import { isString, isFunction } from 'util';
import { Lang } from './Lang';
import { isUndefined } from './typeCheck';

/**
 * object map set
 */
export class ObjectMapSet<TKey, TVal> {
  private valueMap: any;
  private keyMap: any;

  constructor() {
    this.valueMap = {};
    this.keyMap = {};
  }

  clear(): void {
    this.valueMap = {};
    this.keyMap = {};
  }

  getTypeKey(key: TKey) {
    let strKey = '';
    if (isString(key)) {
      strKey = key;
    } else if (isFunction(key)) {
      strKey = (key as any).name;
    } else {
      strKey = key.toString();
    }
    return strKey;
  }

  keys(): TKey[] {
    return Lang.values(this.keyMap);
  }

  values(): TVal[] {
    return Lang.values(this.valueMap);
  }

  delete(key: TKey): boolean {
    let strkey = this.getTypeKey(key).toString();
    try {
      delete this.keyMap[strkey];
      delete this.valueMap[strkey];
      return true;
    } catch {
      return false;
    }
  }

  forEach(
    callbackfn: (value: TVal, key: TKey, map: any) => void,
    thisArg?: any
  ): void {
    Lang.forIn<TKey>(this.keyMap, (val, name) => {
      callbackfn((this.valueMap as any)[name as any], val, this);
    });
  }

  get(key: TKey): TVal {
    let strKey = this.getTypeKey(key);
    return this.valueMap[strKey];
  }

  has(key: TKey): boolean {
    let strKey = this.getTypeKey(key);
    return !isUndefined(this.keyMap[strKey]);
  }

  set(key: TKey, value: TVal): this {
    let strKey = this.getTypeKey(key);

    this.keyMap[strKey] = key;
    this.valueMap[strKey] = value;

    return this;
  }

  get size(): number {
    return Lang.keys(this.keyMap).length;
  }
}
