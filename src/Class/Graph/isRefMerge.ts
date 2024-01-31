import { getMergePinCount } from '../../spec/util/spec'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { IO } from '../../types/IO'
import { getObjSingleKey } from '../../util/object'
import { GraphLike } from './moveSubgraph'

export function isRefMerge(graph: GraphLike, mergeSpec: GraphMergeSpec) {
  let isRef = false

  if (getMergePinCount(mergeSpec) > 0) {
    const sampleMergeUnitId = getObjSingleKey(mergeSpec)
    const sampeMergeUnit = mergeSpec[sampleMergeUnitId]
    const sampleMergeUnitType = getObjSingleKey(sampeMergeUnit) as IO
    const sampleMergeUnitPinId = getObjSingleKey(
      sampeMergeUnit[sampleMergeUnitType]
    )

    const unit = graph.getUnit(sampleMergeUnitId)

    const ref = unit.isPinRef(sampleMergeUnitType, sampleMergeUnitPinId)

    if (ref) {
      isRef = true
    }
  }

  return isRef
}
