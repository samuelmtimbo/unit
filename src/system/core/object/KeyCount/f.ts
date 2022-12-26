import { Dict } from '../../../../types/Dict'
import { length } from '../../../f/array/Length/f'
import { keys } from '../../../f/object/Keys/f'

export default function _keyCount<T>({ obj }: { obj: Dict<any> }): {
  count: number
} {
  return { count: keyCount(obj) }
}

export function keyCount<T>(obj: Dict<any>): number {
  const _keys = keys(obj)
  const _length = length(_keys)

  return _length
}
