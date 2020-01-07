import * as fs from 'fs'

export default class File {
  static exists(file_path: string): boolean {
    return fs.existsSync(file_path)
  }
}
