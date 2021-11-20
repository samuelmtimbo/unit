import { Graph } from './Class/Graph/index'
import { getGlobalRef } from './global'
import { C } from './interface/C'
import { G } from './interface/G'
import { PO } from './interface/PO'
import { U } from './interface/U'
import { System } from './system'
import { BundleSpec } from './system/platform/method/process/BundleSpec'
import { GraphSpecs } from './types/index'
import { randomId } from './util/id'

export function spawn(system: System, bundle: BundleSpec): PO {
  const { spec, specs } = bundle

  const graph = new Graph(spec, {}, system)

  graph.play()

  const $pod: PO = {
    refUnit(id: string): U {
      const unit = getGlobalRef(system, id)

      const _unit = unit.connect({}, new Set())

      return _unit
    },

    refGraph(id: string): U & C & G {
      return graph
    },

    getSpecs(): GraphSpecs {
      return specs // TODO
    },

    addGraph(): string {
      return randomId() // TODO
    },
  }

  return $pod
}
