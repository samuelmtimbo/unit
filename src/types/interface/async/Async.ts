import { Dict } from '../../Dict'
import { AsyncWrap } from './AsyncWrap'

export const Async = (
  instance: any,
  _: string[],
  wrapper: Dict<(unit: any) => any>
) => {
  instance.__async = true
  instance.$__ = instance.$__ ?? []

  return AsyncWrap(instance, _, wrapper)
}
