import { Dict } from './types/Dict'
import { clone } from './util/object'

export default function deepSet(
  obj: Dict<any>,
  path: string[],
  value: any
): any {
  let _obj = clone(obj)

  if (path.length > 0) {
    const [head, ...tail] = path

    _obj[head] = deepSet(_obj[head] || {}, tail, value)

    return _obj
  } else {
    return value
  }
}
