import { Dict } from '../../../../types/Dict'
import { clone } from '../../../../util/clone'
import _dissoc from '../../../f/object/Delete/f'

export default function dissocAll<T>(obj: Dict<T>, keys: string[]): Dict<T> {
  let _obj = clone(obj)
  for (const key in keys) {
    _obj = _dissoc(_obj, key)
  }
  return _obj
}
