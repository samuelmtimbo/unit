import { Dict } from '../../../../types/Dict'

export default function propPath<T>(obj: Dict<T>, path: string[]): any {
  let v: any = obj
  for (const p of path) {
    v = obj[p]
    obj = v
  }
  return v
}
