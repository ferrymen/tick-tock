import { Express, Mode } from '../types';
import { IComponent } from './IComponent';

/**
 * generics component.
 */
export interface GComponent<T extends IComponent> extends IComponent {
  /**
   * the node name.
   */
  name: string;

  /**
   * parent node.
   */
  parent?: T;

  /**
   * add node to this component and return self.
   */
  add(node: T): this;

  /**
   * remove node from this component.
   */
  remove(node: T | string): this;

  /**
   * find sub context via express.
   */
  find(express: T | Express<T, boolean>, mode?: Mode): T;

  /**
   * filter in component.
   */
  filter(express: Express<T, void | boolean>, mode?: Mode): T[];

  /**
   * iteration context with express.
   */
  each(express: Express<T, void | boolean>, mode?: Mode): void;

  /**
   * trans all sub nodes. node first iteration.
   */
  trans(express: Express<T, void | boolean>): void;

  /**
   * trans all sub nodes. node last iteration.
   */
  transAfter(express: Express<T, void | boolean>): void;

  /**
   * route up iteration.
   */
  routeUp(express: Express<T, void | boolean>): void;

  /**
   * this component node equals to the node or not.
   */
  equals(node: T): boolean;

  /**
   * get empty node.
   */
  empty(): T;

  /**
   * check this node is empty or not.
   */
  isEmpty(): boolean;
}
