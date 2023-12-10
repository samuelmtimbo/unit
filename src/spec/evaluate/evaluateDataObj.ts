import { Classes, Specs } from '../../types'
import { Dict } from '../../types/Dict'
import { evaluate } from '../evaluate'

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
