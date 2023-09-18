import { Dict } from '../../../../types/Dict'

export default function forEachValueKey<T extends Dict<any>>(
  obj: T,
  callback: <K extends keyof T>(value: T[K], key: K) => void
) {
  for (const key in obj) {
    const value = obj[key]

    callback(value, key)
  }
}
