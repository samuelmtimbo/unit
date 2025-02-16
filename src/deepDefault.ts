import { Dict } from './types/Dict'

export function deepDefault_(
  obj: Dict<any>,
  path: (string | number)[],
  value: any
): void {
  if (path.length > 1) {
    const [head, ...tail] = path

    obj[head] = obj[head] ?? {}

    deepDefault_(obj[head], tail, value)
  } else {
    const [head] = path

    if (obj[head] === undefined) {
      obj[head] = value
    }
  }
}
