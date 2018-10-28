import { GComponent } from '../../components/GComponent';
import { IExecutable } from '../IExecutable';

/***
 * decorator action component
 */
export interface ActionComponent
  extends GComponent<ActionComponent>,
    IExecutable {
  /**
   * insert ActionComponent
   */
  insert(node: ActionComponent, index: number): this;
}
