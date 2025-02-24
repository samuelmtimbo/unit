import { MoveMapping } from '../Class/Graph/buildMoveMap'
import { deepSet_ } from '../deepSet'
import { GraphSelection } from '../types/interface/G'
import { deepGetOrDefault } from '../util/object'

export const reverseSelection = (
  selection: GraphSelection,
  mapping: MoveMapping
): { selection: GraphSelection; mapping: MoveMapping } => {
  const selection_: GraphSelection = {
    unit: [],
    link: [],
    plug: [],
    merge: [],
  }

  const mapping_: MoveMapping = {
    unit: {},
    merge: {},
    link: {},
    plug: {},
  }

  for (const unitId of selection.unit ?? []) {
    const nextUnitId = deepGetOrDefault(
      mapping,
      ['unit', unitId, 'in', 'unit', 'unitId'],
      unitId
    )

    if (nextUnitId) {
      selection_.unit.push(nextUnitId)

      deepSet_(mapping_, ['unit', nextUnitId, 'in', 'unit'], { unitId })
    }
  }

  for (const mergeId of selection.merge ?? []) {
    const nextMergeId = deepGetOrDefault(
      mapping,
      ['merge', mergeId, 'in', 'merge', 'mergeId'],
      undefined
    )

    if (nextMergeId) {
      selection_.merge.push(nextMergeId)

      deepSet_(
        mapping_,
        ['merge', nextMergeId, 'in', 'merge', 'mergeId'],
        mergeId
      )
    }
  }

  for (const { unitId, type, pinId } of selection.link ?? []) {
    const nextUnitId = deepGetOrDefault(
      mapping,
      ['unit', unitId, 'in', 'unit', 'unitId'],
      unitId
    )

    const nextMergeId = deepGetOrDefault(
      mapping,
      ['link', unitId, type, pinId, 'in', 'merge', 'mergeId'],
      undefined
    )

    const template = deepGetOrDefault(
      mapping,
      ['link', unitId, type, pinId, 'in', 'link', 'template'],
      false
    )

    if (nextMergeId || template) {
      //
    } else {
      selection_.link.push({ unitId: nextUnitId, type, pinId })
    }
  }

  for (const { type, pinId, subPinId } of selection.plug ?? []) {
    const nextPlug = deepGetOrDefault(
      mapping,
      ['plug', type, pinId, subPinId, 'in', 'plug', type],
      undefined
    )

    const pin = deepGetOrDefault(
      mapping,
      ['plug', type, pinId, subPinId, 'in', 'link'],
      undefined
    )

    const mergeId = deepGetOrDefault(
      mapping,
      ['plug', type, pinId, subPinId, 'in', 'merge', 'mergeId'],
      undefined
    )

    if (nextPlug) {
      selection_.plug.push(nextPlug)

      deepSet_(
        mapping_,
        [
          'plug',
          nextPlug.type,
          nextPlug.pinId,
          nextPlug.subPinId,
          'in',
          'plug',
          nextPlug.type,
        ],
        { type, pinId, subPinId }
      )
    }

    if (pin) {
      selection_.link.push(pin)
    }

    if (mergeId) {
      if (!selection_.merge.includes(mergeId)) {
        selection_.merge.push(mergeId)
      }
    }
  }

  return { selection: selection_, mapping: mapping_ }
}
