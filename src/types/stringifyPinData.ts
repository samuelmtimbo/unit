import { Classes, Specs } from '.'
import { $ } from '../Class/$'
import { evaluate } from '../spec/evaluate'
import { stringify } from '../spec/stringify'
import { Dict } from './Dict'

export function stringifyPinData(data: {
  input: Dict<any>
  output: Dict<any>
}): { input: Dict<any>; output: Dict<any> } {
  const { input, output } = data
  const _input = stringifyDataObj(input)
  const _output = stringifyDataObj(output)
  const _data = { input: _input, output: _output }
  return _data
}

export function stringifyDataObj(obj: Dict<any>) {
  const _obj = {}
  
  for (const name in obj) {
    const data = obj[name]

    if (data !== undefined) {
      if (data instanceof $) {
        _obj[name] = 'null'
      } else {
        _obj[name] = stringify(data)
      }
    }
  }
  
  return _obj
}

export function evaluateDataObj(
  obj: Dict<any>,
  specs: Specs,
  classes: Classes
): Dict<any> {
  const _obj = {}

  for (const name in obj) {
    const data = obj[name]

    if (data !== undefined) {
      _obj[name] = evaluate(data, specs, classes)
    }
  }

  return _obj
}
