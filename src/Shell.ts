import { spawn, spawnSync, SpawnSyncOptions } from 'child_process'
import { StringUtil as _ } from '@aelesia/commons'

export default class Shell {
  /**
   * Executes shell command and returns output as a string
   * Also removes trailing newline.
   */
  static sh_s(command: string, args?: string[], options?: SpawnSyncOptions): string {
    return spawnSync(command, args, options)
      .stdout.toString()
      .replace('\n', '')
  }

  /**
   * Executes shell command and returns each line output as part of a string array
   * Also removes last line
   */
  static sh_array(command: string, args?: string[], options?: SpawnSyncOptions): string[] {
    let array = spawnSync(command, args, options)
      .stdout.toString()
      .split('\n')
    array.pop()
    return array
  }

  /**
   * Executes shell command and returns output as a number
   */
  static sh_i(command: string, args?: string[], options?: SpawnSyncOptions): number {
    return _._i(spawnSync(command, args, options).stdout.toString())
  }

  static echo(text: string): void {
    spawnSync('echo', [text])
  }

  /**
   * Returns the current directory as a string
   */
  static pwd(): string {
    return this.sh_s('pwd')
  }

  /**
   * Executes an async shell command while piping output to std:io
   */
  static async sh(command: string, args?: string[], options?: SpawnSyncOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      let process = spawn(command, args ?? [], { ...options, ...{ stdio: 'inherit' } })
      process.on('error', e => {
        reject(e)
      })
      process.on('exit', code => {
        code == 0 ? resolve() : reject(new Error('Process exited with code!=0'))
      })
    })
  }

  static async sh_root(path: string, command: string, args?: string[], options?: SpawnSyncOptions): Promise<void> {
    if (path.startsWith('/')) path = path.substr(1)
    else if (path.startsWith('./')) path = path.substr(2)
    else if (path.startsWith('~/')) path = path.substr(2)

    return this.sh(command, args, { ...options, ...{ cwd: this.find_root() + path } })
  }

  private static find_root(): string {
    let pwd = Shell.pwd()
    let nested = pwd.split('/').length
    for (let i = 0; i < nested; i++) {
      let cwd = '.' + '/..'.repeat(i)
      if (this.is_root_node_dir({ cwd })) {
        let a = pwd.split('/')
        let b = ''
        for (let j = 0; j < nested - i; j++) {
          b += a[j] + '/'
        }
        b = b.slice(0, b.length - 1) + '/'
        return b
      }
    }
    throw Error(`Unable to locate package.json in ancestors of '${pwd}'`)
  }

  /**
   * Returns true if this is the root of a node directory
   * (root node directories are determined by the presence of package.json)
   */
  static is_root_node_dir(options?: SpawnSyncOptions): boolean {
    return spawnSync('test', ['-f', 'package.json'], options).status === 0
  }
}
