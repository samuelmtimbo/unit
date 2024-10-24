import { Classes, Specs } from '../../types'
import { Dict } from '../../types/Dict'
import { evaluate } from '../evaluate'

export function evaluateDataObj(
  obj: Dict<any>,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
): Dict<any> {
  const _obj = {}

  for (const name in obj) {
    const data = obj[name]

    if (data !== undefined) {
      _obj[name] = evaluate(data, specs, classes, resolver)
    }
  }

  return _obj
}
