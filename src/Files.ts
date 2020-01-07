import * as fs from 'fs'
import { StringUtil as _ } from '@aelesia/commons'

export class Files {
  static validate(file_path: string): void {
    if (!this.exists(file_path)) throw Error(`File does not exist: ${file_path}`)
  }

  static exists(file_path: string): boolean {
    return fs.existsSync(file_path)
  }

  static read(file_path: string): string {
    this.validate(file_path)
    return fs.readFileSync(file_path, 'utf-8').trim()
  }

  static read_lines(file_path: string): string[] {
    return _.lines(this.read(file_path))
  }

  // static parse(path: string, pattern: RegExp): [string, string][] {
  //   let file = fs.readFileSync(path, 'utf-8')
  //   let row = file.trim().split('\n')
  //   return row.map(it => {
  //     let files = it.split(/[ ]*=>[ ]*/g)
  //     if (files.length!==2)
  //       throw Error(`Invalid syntax in ${path}. Please use the format "file1 => file2"`)
  //     return [files[0], files[1]]
  //   })
  // }
}
