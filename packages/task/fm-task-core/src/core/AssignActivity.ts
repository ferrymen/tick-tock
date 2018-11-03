import { Task } from '../decorators';
import { Activity } from './Activity';

/**
 * assign activity.
 *
 */
@Task
export abstract class AssignActivity<T> extends Activity<T> {}
