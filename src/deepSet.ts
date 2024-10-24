import { Dict } from './types/Dict'
import { clone } from './util/clone'

export default function deepSet(
  obj: Dict<any>,
  path: (string | number)[],
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

export function deepSet_(
  obj: Dict<any>,
  path: (string | number)[],
  value: any
): void {
  if (path.length > 1) {
    const [head, ...tail] = path

    obj[head] = obj[head] ?? {}

    deepSet_(obj[head], tail, value)
  } else {
    const [head] = path

    obj[head] = value
  }
}
