import { $ } from './Class/$'
import { System } from './system'
import { Dict } from './types/Dict'

export function $wrap<T>(system: System, obj: Dict<any>): T {
  const wrap = new (class Wrapped extends $ {
    constructor(system) {
      super(system)

      for (const methodName of Object.keys(obj)) {
        const method = obj[methodName]

        this[methodName] = method
      }
    }
  })(system)

  // @ts-ignore
  return wrap as T
}
