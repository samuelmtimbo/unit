import { Dict } from '../../../../types/Dict'

export default function merge<T, K>(a: Dict<T>, b: Dict<K>): Dict<T | K> {
  return { ...a, ...b }
}
