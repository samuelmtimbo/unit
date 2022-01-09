import { Dict } from '../../../../types/Dict'

export default function forEachKeyValue<T extends Dict<any>>(
  obj: T,
  callback: <K extends keyof T>(value: T[K], key: K) => void
) {
  for (const key in obj) {
    callback(obj[key], key)
  }
}
