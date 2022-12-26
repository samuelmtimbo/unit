import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'

export function callAllDict(all: Dict<Unlisten>): Unlisten {
  return () => {
    forEachValueKey(all, (u) => {
      u()
    })
  }
}
