import { ObjectMap, isArray } from '@ferrymen/fm-ioc-core';

/**
 * events
 *
 */
export interface IEvents {
  /**
   * add event.
   *
   */
  on(name: string, event: (...args: any[]) => void): this;
  /**
   * remove event.
   *
   */
  off(name: string, event?: (...args: any[]) => void): this;
  /**
   * emit event.
   *
   */
  emit(name: string, ...args: any[]): void;
}

/**
 * custom events.
 *
 * @export
 * @class Events
 */
export class Events implements IEvents {
  eventsMap: ObjectMap<Function[]>;
  constructor() {
    this.eventsMap = {};
  }

  on(name: string, event: (...args: any[]) => void) {
    this.eventsMap[name] = this.eventsMap[name] || [];
    if (this.eventsMap[name].indexOf(event) < 0) {
      this.eventsMap[name].push(event);
    }
    return this;
  }

  off(name: string, event?: (...args: any[]) => void) {
    if (this.eventsMap[name]) {
      if (event) {
        this.eventsMap[name].splice(this.eventsMap[name].indexOf(event), 1);
      } else {
        delete this.eventsMap[name];
      }
    }
    return this;
  }

  emit(name: string, ...args: any[]) {
    let events = this.eventsMap[name];
    if (isArray(events)) {
      events.forEach(ev => {
        ev(...args);
      });
    }
  }
}
