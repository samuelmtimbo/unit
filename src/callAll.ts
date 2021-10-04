import forEachKeyValue from './system/core/object/ForEachKeyValue/f'
import { Dict } from './types/Dict'
import { Unlisten } from './Unlisten'

export default function callAll(all: Unlisten[]): Unlisten {
  return () => {
    all.forEach((u) => u())
  }
}

export function callAllDict(all: Dict<Unlisten>): Unlisten {
  return () => {
    forEachKeyValue(all, (u) => {
      u()
    })
  }
}
