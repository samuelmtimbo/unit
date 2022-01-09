import { Dict } from '../../types/Dict'

export const AsyncWrap = (
  unit: any, // RETURN $
  _: string[],
  wrapper: Dict<(unit: any) => any>
): any => {
  const { __ = [] } = unit

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
