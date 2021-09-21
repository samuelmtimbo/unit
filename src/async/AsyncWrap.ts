import { Dict } from '../types/Dict'

export const AsyncWrap = (
  unit: any,
  _: string[],
  wrapper: Dict<(unit: any) => any>
): any => {
  const { _: __ = [] } = unit

  let $unit = unit

  for (const ___ of _) {
    const AsyncWrapper = wrapper[___]

    if (!AsyncWrapper) {
      throw new Error('Async Wrapper is not registered')
    }

    if (!__.includes(___)) {
      $unit = { ...$unit, ...AsyncWrapper(unit) }
    }
  }

  return $unit
}
