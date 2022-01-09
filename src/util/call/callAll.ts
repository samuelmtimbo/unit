import { Unlisten } from '../../types/Unlisten'

export default function callAll(all: Unlisten[]): Unlisten {
  return () => {
    all.forEach((u) => u())
  }
}
