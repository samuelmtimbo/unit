import { Dict } from '../../../../types/Dict'
import length from '../../../f/array/Length/f'
import keys from '../../../f/object/Keys/f'

export default function keyCount<T>({ obj }: { obj: Dict<any> }): {
  count: number
} {
  const { keys: _keys } = keys({ obj })
  const { length: _length } = length({ a: _keys })
  return { count: _length }
}
