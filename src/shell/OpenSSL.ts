import { Files } from '../Files'
import { Shell } from '../Shell'
import { rethrow } from '@aelesia/commons'

export class OpenSSL {
  static encrypt(file_path: string, password: string, remove?: boolean): void {
    Files.validate(file_path)
    Shell._('openssl', [
      'enc',
      '-aes-256-cbc',
      '-pass',
      `pass:${password}`,
      '-salt',
      '-in',
      file_path,
      '-out',
      `${file_path}.enc`
    ])
    console.info(`Encrypted '${file_path}' to ${file_path}.enc`)
    if (remove) {
      Shell._('rm', [file_path])
    }
  }

  static decrypt(file_path: string, password: string, remove?: boolean): void {
    Files.validate(file_path)
    let out = file_path.slice(0, -4)
    try {
      Shell._('openssl', [
        'enc',
        '-d',
        '-aes-256-cbc',
        '-pass',
        `pass:${password}`,
        '-salt',
        '-in',
        `${file_path}`,
        '-out',
        `${out}.tmp`
      ])
      Shell.copy(`${out}.tmp`, out)
      Shell.rm(`${out}.tmp`)
      console.info(`Decrypted '${file_path}' to ${file_path.slice(0, -4)}`)
      if (remove) {
        Shell._('rm', [file_path])
      }
    } catch (e) {
      Shell.rm(`${file_path.slice(0, -4)}.tmp`)
      rethrow(new Error('Incorrect Password. Unable to decrypt file'), e)
    }
  }
}
