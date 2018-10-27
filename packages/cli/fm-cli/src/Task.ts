import * as interpret from 'interpret';
import Liftoff from 'liftoff';
import util from 'util';
import { Arguments } from 'yargs';
import pkgInfo = require('../package.json');

export default class Task {
  private cli: Liftoff;
  private argv: Arguments;

  constructor(argv: Arguments) {
    this.argv = argv;
    this.cli = new Liftoff({
      extensions: interpret.jsVariants,
      moduleName: '@ferrymen/fm-cli',
      name: 'fm',
      processTitle: 'fm-cli',
    }).on('require', name => {
      console.log('Require external module', name);
    });
  }

  /**
   * launch
   */
  public launch() {
    const self = this;
    this.cli.launch(
      {
        completion: this.argv.completion,
        cwd: this.argv.cwd,
        require: this.argv.require,
        taskfile: this.argv.taskfile,
        verbose: this.argv.verbose,
      },
      env => {
        if (self.argv.info) {
          console.log(`CLI version ${pkgInfo.version}`);
          if (
            env.modulePackage &&
            !util.isUndefined(env.modulePackage.version)
          ) {
            console.log(`Local version ${env.modulePackage.version}`);
          }
          process.exit(0);
        }

        if (self.argv.verbose) {
          console.log('LIFTOFF SETTINGS: ', this);
        }

        if (!env.configPath) {
          console.log('No taskfile found');
        }

        if (process.cwd() !== env.cwd) {
          process.chdir(env.cwd);
          console.log(`Working directory changed to ${env.cwd}`);
        }

        if (!env.modulePath) {
          console.log(
            `Local ${self.cli.moduleName} module not found in: ${env.cwd}`
          );
          process.exit();
        }

        console.log(`Using taskfile ${env.configPath}`);

        require(env.configPath);
      }
    );
  }
}
