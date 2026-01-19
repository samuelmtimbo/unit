import { Dict } from '../../Dict'
import { AsyncWrap } from './AsyncWrap'

export const Async = (
  instance: any,
  _: string[],
  wrapper: Dict<(unit: any) => any>
) => {
  instance.$__ = instance.$__ ?? []

  return AsyncWrap(instance, _, wrapper)
}
