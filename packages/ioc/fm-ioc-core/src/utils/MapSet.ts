import { isClass } from './typeCheck';
import { ObjectMapSet } from './ObjectMapSet';

export class MapSet<TKey, TVal> {
  private map: ObjectMapSet<TKey, TVal> | Map<TKey, TVal>;

  constructor() {
    this.map = isClass(Map)
      ? new Map<TKey, TVal>()
      : new ObjectMapSet<TKey, TVal>();
  }

  keys(): TKey[] {
    return this.map.keys() as TKey[];
  }

  values(): TVal[] {
    return this.map.values() as TVal[];
  }

  clear(): void {
    this.map.clear();
  }

  delete(key: TKey): boolean {
    return this.map.delete(key);
  }
  forEach(
    callbackfn: (value: TVal, key: TKey, map: any) => void,
    thisArg?: any
  ): void {
    let map = this.map as any;
    map.forEach(callbackfn, thisArg);
  }
  get(key: TKey): TVal | undefined {
    return this.map.get(key);
  }
  has(key: TKey): boolean {
    return this.map.has(key);
  }
  set(key: TKey, value: TVal): this {
    this.map.set(key, value);
    return this;
  }
  get size(): number {
    return this.map.size;
  }
}
