import { Dict } from '../../Dict'

export const AsyncWrap = (
  unit: any,
  _: string[],
  wrapper: Dict<(unit: any) => any>
): any => {
  let $unit = unit

  $unit.$__ = $unit.$__ ?? []

  for (const __ of ['$', ..._]) {
    if (!$unit.$__.includes(__)) {
      $unit.$__.push(__)

      const AsyncWrapper = wrapper[__]

      if (!AsyncWrapper) {
        throw new Error('async wrapper is not registered')
      }

      const api = AsyncWrapper(unit)

      for (const method in api) {
        $unit[method] = api[method]
      }
    }
  }

  return $unit
}
