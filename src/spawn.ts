import { Graph } from './Class/Graph/index'
import { getGlobalRef } from './client/globalUnit'
import { C } from './interface/C'
import { G } from './interface/G'
import { PO } from './interface/PO'
import { U } from './interface/U'
import { System } from './system'
import { BundleSpec } from './system/platform/method/process/BundleSpec'
import { GraphSpecs } from './types/index'

export function spawn(bundle: BundleSpec): PO {
  const { spec } = bundle

  const graph = new Graph(spec)

  graph.play()

  const $pod: PO = {
    refGlobalUnit(id: string): void {
      const unit = getGlobalRef(id)
      const _unit = unit.connect({}, new Set())
      return _unit
    },

    graph(): U & C & G {
      return graph
    },

    attach($system: System): void {
      graph.attach($system, $pod)
    },

    getSpecs(): GraphSpecs {
      return {}
    },
  }

  return $pod
}
