import { destroy } from '../boot'
import { $ } from '../Class/$'
import { Graph } from '../Class/Graph'
import { fromBundle } from '../spec/fromBundle'
import { System } from '../system'
import { BundleSpec } from '../types/BundleSpec'
import { GraphBundle } from '../types/GraphClass'
import { S } from '../types/interface/S'
import { Unlisten } from '../types/Unlisten'

export function _newSystem(system: System, _system: System): [S, Unlisten] {
  const new_system = system.boot({})

  const _new_system = wrapSystem(new_system, _system)

  return [
    _new_system,
    () => {
      destroy(system)
    },
  ]
}

export function wrapSystem(system: System, _system: System): $ & S {
  return new (class System extends $ implements S {
    fromBundle(bundleSpec: BundleSpec): GraphBundle<any, any> {
      return fromBundle(bundleSpec, _system.specs)
    }
    newGraph(bundle: GraphBundle<any, any>): Graph<any, any> {
      return system.newGraph(bundle)
    }
    newSystem(opt: {}): [S, Unlisten] {
      return _newSystem(system, _system)
    }
  })(_system)
}
