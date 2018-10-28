import { IContainer } from '../IContainer';
import { ActionData } from './ActionData';

/**
 * execute action
 */
export interface IExecutable {
  /**
   * execute the action work.
   *
   */
  execute<T>(container: IContainer, data: ActionData<T>, name?: string): void;
}
