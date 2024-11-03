import { stringify } from '../spec/stringify'
import { Dict } from './Dict'

export function stringifyPinData(
  data: {
    input: Dict<any>
    output: Dict<any>
  },
  deref: boolean = false
): { input: Dict<any>; output: Dict<any> } {
  const { input, output } = data

  const _input = stringifyDataObj(input, deref)
  const _output = stringifyDataObj(output, deref)

  const _data = { input: _input, output: _output }

  return _data
}

export function stringifyDataObj(obj: Dict<any>, deref: boolean = false) {
  const _obj = {}

  for (const name in obj) {
    const data = obj[name]

    if (data !== undefined) {
      _obj[name] = stringify(data, deref)
    }
  }

  return _obj
}
