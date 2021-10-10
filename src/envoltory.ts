import { $ } from './Class/$'
import { Dict } from './types/Dict'

export function envolve(
  interf: Dict<(...args: any[]) => any>,
  __: string[]
): $ {
  return new (class Class extends $ {
    _ = __

    constructor() {
      super()

      for (const name in interf) {
        const method = interf[name]
        this[name] = method
      }
    }
  })()
}
