import fs from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'
import { CommandModule } from 'yargs'

/**
 * Util Command
 */
export default class Command {
  /**
   * Custom command directory
   */
  public cmdDir: string

  constructor(dir: string) {
    this.cmdDir = dir
  }

  /**
   * Load command from `cmdDir` that the defined directory
   */
  public async load(): Promise<CommandModule[]> {
    const commads: CommandModule[] = []
    const readdir = promisify(fs.readdir)
    const stat = promisify(fs.stat)

    try {
      const cmdDirSt = await stat(this.cmdDir)

      if (cmdDirSt.isDirectory()) {
        const cmdDirRoots = await readdir(this.cmdDir)

        for (const cmdDirRoot of cmdDirRoots) {
          const cmdDirPart = resolve(this.cmdDir, cmdDirRoot)

          if ((await stat(cmdDirPart)).isDirectory()) {
            const cmdClass = (await import(cmdDirPart)).default
            commads.push(new cmdClass())
          }
        }
      }
    } catch (error) {
      console.error(error)
    }

    return commads
  }
}
