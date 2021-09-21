import { Dict } from '../../../../types/Dict'

export default function assoc<T, V>(
  obj: Dict<T>,
  key: string | number,
  value: V
): Dict<T | V> {
  return { ...obj, [key]: value }
}
