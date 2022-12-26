import { Graph } from '../Class/Graph'
import { GraphSubPinSpec } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'
import { IOOf, _IOOf } from '../types/IOOf'
import { Moment } from './Moment'

export interface LeafMoveSubgraphIntoMomentData {
  path: string[]
  graphId: string
  nodeIds: {
    merge: string[]
    link: {
      unitId: string
      type: IO
      pinId: string
    }[]
    unit: string[]
    plug: {
      type: IO
      pinId: string
      subPinId: string
    }[]
  }
  nextIdMap: {
    merge: Dict<string>
    link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
    plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
    unit: Dict<string>
  }
  nextPinIdMap: Dict<{
    input: Dict<{ pinId: string; subPinId: string }>
    output: Dict<{ pinId: string; subPinId: string }>
  }>
  nextMergePinId: Dict<{
    input: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
    output: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
  }>
  nextPlugSpec: {
    input: Dict<Dict<GraphSubPinSpec>>
    output: Dict<Dict<GraphSubPinSpec>>
  }
  nextSubComponentParentMap: Dict<string | null>
  nextSubComponentChildrenMap: Dict<string[]>
}

export interface LeafMoveSubgraphIntoMoment
  extends Moment<LeafMoveSubgraphIntoMomentData> {
  type: 'unit'
  event: 'leaf_move_subgraph_into'
}

export function watchUnitLeafMoveSubgraphIntoEvent(
  event: 'leaf_move_subgraph_into',
  unit: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
    graphId,
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
    path
  ) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
        graphId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
      },
    })
  }

  unit.prependListener(event, listener)

  return () => {
    unit.removeListener(event, listener)
  }
}
