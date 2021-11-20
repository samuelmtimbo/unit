export default function forEachKeyValue<V>(
  obj: {
    [key: string]: V
  },
  callback: (value: V, key: string) => void
) {
  for (const key in obj) {
    callback(obj[key], key)
  }
}
