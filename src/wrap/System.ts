import { InterceptOpt, ServerHandler } from '../API'
import { $ } from '../Class/$'
import { Graph } from '../Class/Graph'
import { System } from '../system'
import { BundleSpec } from '../types/BundleSpec'
import { S } from '../types/interface/S'
import { Unlisten } from '../types/Unlisten'

export function wrapSystem(system: System, _system: System): $ & S {
  return new (class System extends $ implements S {
    intercept(opt: InterceptOpt, handler: ServerHandler): Unlisten {
      return system.intercept(opt, handler)
    }
    start(bundle: BundleSpec): Graph {
      return system.start(bundle)
    }
  })(_system)
}
