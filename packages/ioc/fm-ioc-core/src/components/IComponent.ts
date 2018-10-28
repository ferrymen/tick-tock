import { Express, Mode } from '../types';

/**
 * component.
 */
export interface IComponent {
  /**
   * the node name.
   */
  name: string;

  /**
   * parent node.
   */
  parent?: IComponent;

  /**
   * add node to this component and return self.
   */
  add(node: IComponent): this;

  /**
   * remove node from this component.
   */
  remove(node: IComponent | string): this;

  /**
   * find sub context via express.
   */
  find(
    express: IComponent | Express<IComponent, boolean>,
    mode?: Mode
  ): IComponent;

  /**
   * filter in component.
   */
  filter(
    express: Express<IComponent, void | boolean>,
    mode?: Mode
  ): IComponent[];

  /**
   * iteration context with express.
   */
  each(express: Express<IComponent, void | boolean>, mode?: Mode): void;

  /**
   * trans all sub nodes. node first iteration.
   */
  trans(express: Express<IComponent, void | boolean>): boolean;

  /**
   * trans all sub nodes. node last iteration.
   *
   * @param {(Express<IComponent, void | boolean>)} express
   * @memberof IComponent
   */
  transAfter(express: Express<IComponent, void | boolean>): boolean;

  /**
   * route up iteration.
   *
   * @param {(Express<IComponent, void | boolean>)} express
   * @memberof IComponent
   */
  routeUp(express: Express<IComponent, void | boolean>): void;

  /**
   * this component node equals to the node or not.
   *
   */
  equals(node: IComponent): boolean;

  /**
   * get empty node.
   *
   * @returns {IComponent}
   * @memberof IComponent
   */
  empty(): IComponent;

  /**
   * check this node is empty or not.
   *
   */
  isEmpty(): boolean;
}
