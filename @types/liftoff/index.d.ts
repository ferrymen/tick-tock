// Type definitions for "interpret": "^1.1.0"
// Project: https://github.com/gulpjs/interpret

export = Liftoff;

declare class Liftoff {
  constructor(opts: Liftoff.Options);
  requireLocal(): void;
  buildEnvironment(): void;
  handleFlags(): void;
  launch(opts: Liftoff.CliOptions, fn: (e: Liftoff.EnvOptions) => any): void;
  on(event: string, fn: (e: any) => any): this;
  moduleName: any;
}

declare namespace Liftoff {
  export interface Options {
    extensions?: object;
    searchPaths?: [];
    name: string;
    processTitle: string;
    configName?: string;
    moduleName?: string;
  }
  export interface CliOptions {
    cwd?: string;
    taskfile?: string;
    require?: string;
    completion?: string;
    verbose?: string;
  }
  export interface EnvOptions {
    cwd: string;
    require?: string;
    configNameSearch?: string;
    configPath: string;
    configBase?: string;
    modulePath?: string;
    modulePackage: any;
    configFiles: string;
  }
}

// export = Liftoff;

// interface Options {
//   extensions?: object;
//   searchPaths?: [];
//   name: string;
//   processTitle: string;
//   configName?: string;
//   moduleName?: string;
// }

// declare function Liftoff(opts: Options): Liftoff.Inst;

// declare namespace Liftoff {
//   interface Inst {
//     requireLocal(): void;
//     buildEnvironment(): void;
//     handleFlags(): void;
//     launch(): void;
//     on(event: string, fn: (e: any) => any): Liftoff.Inst;
//   }
// }

// declare module "liftoff" {

// }
