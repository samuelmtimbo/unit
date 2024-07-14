import { Key } from './types/Key'

export default function deepGet(obj: object, path: Key[]): any {
  let v: any = obj

  for (const p of path) {
    v = obj[p]
    obj = v
  }

  return v
}
