import { $ } from '../Class/$'
import { Graph } from '../Class/Graph'
import { System } from '../system'
import { BundleSpec } from '../types/BundleSpec'
import { S } from '../types/interface/S'

export function wrapSystem(system: System, _system: System): $ & S {
  return new (class System extends $ implements S {
    start(bundle: BundleSpec): Graph {
      return system.start(bundle)
    }
  })(_system)
}
