import { $ } from '../Class/$'
import { stringify } from '../spec/stringify'
import { Dict } from './Dict'

export function stringifyPinData(data: {
  input: Dict<any>
  output: Dict<any>
}): { input: Dict<any>; output: Dict<any> } {
  const { input, output } = data
  const _input = {}
  const _output = {}
  for (const input_name in input) {
    const input_data = input[input_name]
    if (input_data !== undefined) {
      if (input_data instanceof $) {
        _input[input_name] = 'null'
      } else {
        _input[input_name] = stringify(input_data)
      }
    }
  }
  for (const output_name in output) {
    const output_data = output[output_name]
    if (output_data !== undefined) {
      if (output_data instanceof $) {
        _output[output_name] = 'null'
      } else {
        _output[output_name] = stringify(output_data)
      }
    }
  }
  const _data = { input: _input, output: _output }
  return _data
}
