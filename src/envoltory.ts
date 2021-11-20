import { $ } from './Class/$'
import { System } from './system'
import { Dict } from './types/Dict'

export function envolve(
  system: System,
  interf: Dict<(...args: any[]) => any>,
  __: string[]
): $ {
  return new (class Class extends $ {
    __ = __

    constructor(system: System) {
      super(system)

      for (const name in interf) {
        const method = interf[name]
        this[name] = method
      }
    }
  })(system)
}
