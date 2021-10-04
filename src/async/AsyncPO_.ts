import { PO } from '../interface/PO'
import { $Graph } from './$Graph'
import { $PO, $PO_C, $PO_R, $PO_W } from './$PO'
import { AsyncGraph } from './AsyncGraph'

export const AsyncPOCall: (pod: PO) => $PO_C = (pod) => {
  return {}
}

export const AsyncPOWatch: (pod: PO) => $PO_W = (pod) => {
  return {}
}

export const AsyncPORef: (pod: PO) => $PO_R = (pod) => {
  return {
    $refGlobalUnit(data: { id: string; _: string[] }): void {},

    $graph({}: {}): $Graph {
      const graph = pod.graph()
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
