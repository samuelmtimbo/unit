import { $ } from './Class/$'
import { Pod } from './pod'
import { System } from './system'
import { Dict } from './types/Dict'

export function envolve(
  system: System,
  pod: Pod,
  interf: Dict<(...args: any[]) => any>,
  __: string[]
): $ {
  return new (class Class extends $ {
    __ = __

    constructor(system: System, pod: Pod) {
      super(system, pod)

      for (const name in interf) {
        const method = interf[name]
        this[name] = method
      }
    }
  })(system, pod)
}
