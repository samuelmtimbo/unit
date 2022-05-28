import { Specs } from '../..'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { P } from '../P'
import { $Graph } from './$Graph'
import { $P, $P_C, $P_R, $P_W } from './$P'
import { AsyncGraph } from './AsyncGraph'

export const AsyncPCall: (pod: P) => $P_C = (pod) => {
  return {
    $getSpecs(data: {}, callback: Callback<Specs>): void {
      const specs = pod.getSpecs()

      callback(specs)
    },
  }
}

export const AsyncPWatch: (pod: P) => $P_W = (pod) => {
  return {}
}

export const AsyncPRef: (pod: P) => $P_R = (pod) => {
  return {
    $refGlobalUnit(data: { id: string; _: string[] }): void {},

    $refGraph({ bundle }: { bundle: BundleSpec }): $Graph {
      const [mapping, graph] = pod.newGraph(bundle)

      return AsyncGraph(graph)
    },
  }
}

export const AsyncPO: (pod: P) => $P = (pod: P) => {
  return {
    ...AsyncPCall(pod),
    ...AsyncPWatch(pod),
    ...AsyncPRef(pod),
  }
}
