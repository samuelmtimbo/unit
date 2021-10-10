import { Dict } from '../../../../types/Dict'

export default function _dissoc<T>(
  obj: Dict<T>,
  key: string | number
): Dict<T> {
  const _obj = { ...obj }
  delete _obj[key]
  return _obj
}
