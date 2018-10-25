import { CommandModule } from 'yargs';

/**
 * Run the defined task
 */
export default class Run implements CommandModule {
  public command: string = 'run';
  public describe: string = 'run a task';
  /**
   * handler
   */
  public handler() {
    //
  }
}
