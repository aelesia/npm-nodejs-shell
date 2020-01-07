import Arg from '../src/Arg'

describe('Arg', () => {
  test('arg_v', async () => {
    process.argv = ['key=value']
    expect(Arg.v('key')).toEqual('value')
  })

  test('arg_v_newline', async () => {
    process.argv = ['\n' + 'key=value 123=' + '\n']
    expect(Arg.v('key')).toEqual('value 123=')
  })

  test('arg_v_error', async () => {
    process.argv = ['key=value']
    expect(Arg.v('key')).toEqual('value')
    expect(() => Arg.v('key2')).toThrowError()
  })

  test('arg_v_null', async () => {
    process.argv = ['']
    expect(Arg.v_null('key')).toBeUndefined()
  })

  test('arg_number', async () => {
    process.argv = ['key=123']
    expect(Arg.v_number('key')).toEqual(123)
  })

  test('arg_number_error', async () => {
    process.argv = ['key1=123']
    expect(() => Arg.v_number('key')).toThrowError()
  })

  test('arg_number_type_error', async () => {
    process.argv = ['key=value']
    expect(() => Arg.v_number('key')).toThrowError()
  })

  test('arg_number_null', async () => {
    process.argv = ['']
    expect(Arg.v_number_null('key')).toBeUndefined()
  })

  test('arg_boolean_true', async () => {
    process.argv = ['key=true']
    expect(Arg.v_boolean('key')).toEqual(true)
  })

  test('arg_boolean_false', async () => {
    process.argv = ['key=false']
    expect(Arg.v_boolean('key')).toEqual(false)
  })

  test('arg_boolean_error', async () => {
    process.argv = ['key=value']
    expect(() => Arg.v_boolean('key')).toThrowError()
  })

  test('arg_boolean_null', async () => {
    process.argv = ['']
    expect(Arg.v_boolean_null('key')).toBeUndefined()
  })

  test('arg_enum', async () => {
    process.argv = ['key=value']
    expect(Arg.v_enum('key', ['value'])).toEqual('value')
  })

  test('arg_enum_missing_key', async () => {
    process.argv = ['key2=value']
    expect(() => {
      Arg.v_enum('key', ['value'])
    }).toThrowError()
  })

  test('arg_enum_wrong_value', async () => {
    process.argv = ['key=value2']
    expect(() => {
      Arg.v_enum('key', ['value'])
    }).toThrowError()
  })

  test('arg_enum_null', async () => {
    process.argv = ['key2=value2']
    expect(Arg.v_enum_null('key', ['value'])).toBeUndefined()
  })

  test('arg_first_enum', async () => {
    process.argv = ['', '', 'command']
    expect(Arg.v_first_enum(['command'])).toEqual('command')
  })

  test('arg_first_enum_error', async () => {
    process.argv = ['', '', 'command']
    expect(() => {
      Arg.v_first_enum(['something'])
    }).toThrowError()
  })

  test('arg_first_enum_no_argument', async () => {
    process.argv = ['', '']
    expect(() => {
      Arg.v_first_enum(['command'])
    }).toThrowError()
  })
})
