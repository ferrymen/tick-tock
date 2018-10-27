import { resolve } from 'path';
import yargs, { Arguments } from 'yargs';
import pkgInfo = require('../package.json');
import Command from './utils/command';

/**
 * Main class Cli that register commands and launch command
 */
class Cli {
  /**
   * Bootstrap application via register CLI modules and process provided argv
   * @param args
   */
  public async bootstrap(args: Arguments): Promise<void> {
    try {
      const commandInst = new Command(resolve(__dirname, 'commands'));
      const commands = await commandInst.load();
      for (const command of commands) {
        yargs.command(command);
      }
      // tslint:disable-next-line:no-unused-expression
      yargs
        .strict()
        .wrap(yargs.terminalWidth())
        .help()
        .alias('help', 'h')
        .showHelpOnFail(true)
        .version(pkgInfo.version)
        .alias('version', 'v')
        .usage(`Usage: $0 <command> [option]`)
        .demandCommand(1, 'A command must be called as argument')
        .fail(msg => {
          yargs.showHelp();
          process.exit(1);
        }).argv;
    } catch (error) {
      throw error;
    }
  }
}

export default Cli;
