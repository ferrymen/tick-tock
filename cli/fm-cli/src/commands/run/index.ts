import { Arguments, Argv, CommandModule } from 'yargs';
import Task from '../../task';

/**
 * Run the defined task
 */
export default class Run implements CommandModule {
  public command: string = 'run';
  public describe: string = 'run a task';
  /**
   * builder
   */
  public builder(yargs: Argv): Argv {
    return yargs
      .option('info', {
        describe: 'List info',
      })
      .option('verbose', {
        describe: 'Show log',
      });
  }
  /**
   * handler
   */
  public handler(argv: Arguments) {
    // tslint:disable-next-line:no-unused-expression
    const task = new Task(argv);
    task.launch();
  }
}
