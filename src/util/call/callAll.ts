import { Unlisten } from '../../types/Unlisten'

export function callAll(all: Unlisten[]): Unlisten {
  return () => {
    all.forEach((u) => u())
  }
}
