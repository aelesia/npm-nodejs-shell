import { Files } from '../src/Files'

describe('File', () => {
  test('file exists', async () => {
    expect(Files.exists('./tests/files/test.txt')).toBeTruthy()
  })

  test('file does not exist', async () => {
    expect(Files.exists('./tests/files/non-existent-file.txt')).toBeFalsy()
  })

  test('read file', async () => {
    expect(Files.read('./tests/files/test.txt')).toEqual('test')
  })

  test('read file error', async () => {
    expect(() => {
      Files.read('./tests/files/non-existent-file.txt')
    }).toThrowError()
  })

  test('read file lines', async () => {
    expect(Files.read_lines('./tests/files/test-multiline.txt')).toEqual(['test', 'test2', 'test3'])
  })
})
