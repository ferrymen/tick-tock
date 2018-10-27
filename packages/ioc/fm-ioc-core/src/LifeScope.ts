import { ActionData } from './core/ActionData';
import { ActionComponent } from './core/actions';
import { InjectToken } from './InjectToken';

/**
 * life scope interface symbol.
 * it is a symbol id, you can register yourself MethodAccessor for this.
 */
export const LifeScopeToken = new InjectToken<LifeScope>('DI_LifeScope');

/**
 * life scope of decorator
 */
export interface LifeScope {
  /**
   * execute the action work
   *
   * @param data
   * @param names
   */
  execute<T>(data: ActionData<T>, ...names: string[]): void;

  /**
   * execute the action work route with parent container.
   */
  routeExecute<T>(data: ActionData<T>, ...names: string[]): void;

  /**
   * register action.
   */
  addAction(action: ActionComponent, ...nodepaths: string[]): this;

  /**
   * register decorator.
   *
   */
  registerDecorator(decorator: Function, ...actions: string[]): this;
}
