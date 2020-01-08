import { Shell } from '../src/Shell'
import { Files } from '../src/Files'

describe('Shell', () => {
  test('pwd', async () => {
    expect(Shell.pwd()).toContain('npm-nodejs-shell')
  })

  test('sh_s', async () => {
    expect(Shell.sh_s('echo', ['abc'])).toEqual('abc')
  })
  test('sh_array', async () => {
    expect(Shell.sh_array('echo', ['abc\n123\ndef'])).toEqual(['abc', '123', 'def'])
  })

  test('sh_i', async () => {
    expect(Shell.sh_i('echo', ['123'])).toEqual(123)
  })

  test('sh_i error', async () => {
    expect(() => {
      Shell.sh_i('echo', ['abc'])
    }).toThrowError()
  })

  test('echo', async () => {
    expect(() => {
      Shell.echo('test_echo')
    }).not.toThrowError()
  })

  test('sh_sync', async () => {
    await expect(Shell.sh('echo', ['test_sh_sync'])).resolves.not.toThrow()
  })

  test('sh_sync_error', async () => {
    await expect(Shell.sh('qwerty', ['test_sh_error'])).rejects.toThrow()
  })

  test('sh_async', async () => {
    await expect(Shell.sh('bash', ['./tests/shell/async.sh'])).resolves.not.toThrow()
  })

  test('sh_async_error', async () => {
    await expect(Shell.sh('bash', ['./tests/shell/async_error.sh'])).rejects.toThrow()
  })

  test('sh no params', async () => {
    await expect(Shell.sh('pwd')).resolves.not.toThrow()
  })

  test('sh_root', async () => {
    await expect(Shell.sh_root('tests', 'echo', ['test_sh_root'])).resolves.not.toThrow()
    await expect(Shell.sh_root('/tests', 'echo', ['test_sh_root'])).resolves.not.toThrow()
    await expect(Shell.sh_root('./tests', 'echo', ['test_sh_root'])).resolves.not.toThrow()
    await expect(Shell.sh_root('~/tests', 'echo', ['test_sh_root'])).resolves.not.toThrow()
  })

  test('sh_root_no_dir', async () => {
    await expect(Shell.sh_root('qwerty', 'echo', ['test_sh_root'])).rejects.toThrow()
  })

  describe('Copy / Delete', () => {
    test('sh_copy', async () => {
      Shell.copy('./tests/files/test.txt', './tests/files/test-copy.txt')
      expect(Files.exists('./tests/files/test-copy.txt')).toBeTruthy()
    })
    test('sh_rm', async () => {
      Shell.rm('./tests/files/test-copy.txt')
      expect(Files.exists('./tests/files/test-copy.txt')).toBeFalsy()
    })
  })

  test('exec_error', async () => {
    expect(() => {
      Shell._('blahblah')
    }).toThrowError()
  })

  test('exec', async () => {
    expect(Shell._('echo', ['hello'])).toContain('hello')
  })

  test('exec sleep', async () => {
    expect(Shell._('sleep', ['1'])).toEqual('')
  })

  test('exec return -1', async () => {
    expect(() => {
      Shell._('bash', ['./tests/shell/sync_error.sh'])
    }).toThrowError()
  })

  test('find_root', async () => {
    jest.spyOn(Shell, 'is_root_node_dir').mockImplementation((opt: any) => {
      // console.log(opt.cwd)
      return false
    })
    expect(() => {
      // @ts-ignore
      Shell.find_root()
    }).toThrowError()
  })
})
