import { Callback } from '../../Callback'
import { GraphSpecs, Specs } from '../../types'
import { PO } from '../PO'
import { $Graph } from './$Graph'
import { $PO, $PO_C, $PO_R, $PO_W } from './$PO'
import { AsyncGraph } from './AsyncGraph'

export const AsyncPOCall: (pod: PO) => $PO_C = (pod) => {
  return {
    $getSpecs(data: {}, callback: Callback<Specs>): void {
      const specs = pod.getSpecs()

      callback(specs)
    },
  }
}

export const AsyncPOWatch: (pod: PO) => $PO_W = (pod) => {
  return {}
}

export const AsyncPORef: (pod: PO) => $PO_R = (pod) => {
  return {
    $refGlobalUnit(data: { id: string; _: string[] }): void {},

    $graph({ id }: { id: string }): $Graph {
      const graph = pod.refGraph(id)

      return AsyncGraph(graph)
    },
  }
}

export const AsyncPO: (pod: PO) => $PO = (pod: PO) => {
  return {
    ...AsyncPOCall(pod),
    ...AsyncPOWatch(pod),
    ...AsyncPORef(pod),
  }
}
