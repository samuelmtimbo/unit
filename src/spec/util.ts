import { GraphMoveSubGraphData } from '../Class/Graph/interface'
import { segmentMergeNodeId } from '../client/id'
import { getSpec } from '../client/spec'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { keyCount } from '../system/core/object/KeyCount/f'
import { keys } from '../system/f/object/Keys/f'
import { GraphConnectUnitPlugsOpt } from '../system/platform/component/app/Editor/Component'
import { isEmptyMerge } from './isEmptyMerge'
import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphMergeUnitSpec,
  GraphPinSpec,
  GraphPinsSpec,
  GraphPlugOuterSpec,
  GraphSubPinSpec,
  PinSpec,
  Spec,
  Specs,
} from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { IO } from '../types/IO'
import {
  reduceObj,
  _keyCount,
  pathOrDefault,
  pathSet,
  clone,
} from '../util/object'

export function isValidSpecName(name: string) {
  return !!/^[A-Za-z_ ][A-Za-z\d_ ]*$/g.exec(name)
}

export function getPinNodeId(unitId: string, type: IO, pinId: string): string {
  return `${unitId}/${type}/${pinId}`
}

export function isUnitPinConstant(
  spec: GraphSpec,
  unitId: string,
  type: IO,
  pinId: string
): boolean {
  return pathOrDefault(spec, [unitId, type, pinId, 'constant'], false)
}

export function getInputNodeId(unitId: string, pinId: string): string {
  return getPinNodeId(unitId, 'input', pinId)
}

export function getOutputNodeId(unitId: string, pinId: string): string {
  return getPinNodeId(unitId, 'output', pinId)
}

export function getExposedPinId(id: string, type: string): string {
  return `${type}/${id}`
}

export function getMergePinNodeId(mergeId: string, type: IO): string {
  return `${mergeId}/${type}`
}

export function opposite(kind: IO): IO {
  return kind === 'input' ? 'output' : 'input'
}

export const findFirstMergePin = (
  merge: GraphMergeSpec,
  type: IO
): { unitId: string; pinId: string } | undefined => {
  for (const unitId in merge) {
    if (merge[unitId][type]) {
      for (const pinId in merge[unitId][type]) {
        return {
          unitId,
          pinId,
        }
      }
    }
  }
}

export const getPinSpec = (
  graph: GraphSpec,
  type: IO,
  pinId: string
): GraphPinSpec => {
  return pathOrDefault(graph, [`${type}s`, pinId], null)
}

export const getPlugSpecs = (spec: GraphSpec) => {
  const plugs = {
    input: {},
    output: {},
  }

  forEachGraphSpecPinPlug(
    spec,
    (type, pinId, pinSpecs, subPinId, subPinSpec) => {
      const plug = getSubPinSpec(spec, type, pinId, subPinId)

      pathSet(plugs, [type, pinId, subPinId], plug)
    }
  )

  return plugs
}

export const getSubPinSpec = (
  graph: GraphSpec,
  type: IO,
  pinId: string,
  subPinId: string
): GraphSubPinSpec => {
  return pathOrDefault(graph, [`${type}s`, pinId, 'plug', subPinId], null)
}

export const findPinMerge = (
  spec: GraphSpec,
  unitId: string,
  type: IO,
  pinId: string
): string | undefined => {
  const { merges = {} } = spec
  for (const mergeId in merges) {
    const merge = merges[mergeId]

    if (merge?.[unitId]?.[type]?.[pinId]) {
      return mergeId
    }
  }
}

export const getPlugCount = (
  spec: GraphSpec,
  type: IO,
  pinId: string
): number => {
  return keyCount(pathOrDefault(spec, [`${type}s`, pinId, 'plug'], {}))
}

export const getMergePinCount = (merge: GraphMergeSpec): number => {
  return reduceObj(
    merge,
    (count, mergeUnit) => {
      return count + getMergeUnitPinCount(mergeUnit)
    },
    0
  )
}

export const getMergeUnitPinCount = (
  merge_unit: GraphMergeUnitSpec
): number => {
  const { input = {}, output = {} } = merge_unit
  const input_count = _keyCount(input)
  const output_count = _keyCount(output)
  const count = input_count + output_count
  return count
}

export const forEachPinOnMerges = (
  merges: GraphMergesSpec,
  callback: (mergeId: string, unitId: string, type: IO, pinId: string) => void
) => {
  forEachValueKey(merges || {}, (merge, mergeId) => {
    forEachPinOnMerge(merge, (unitId, type, pinId) =>
      callback(mergeId, unitId, type, pinId)
    )
  })
}

export const forEachPinOnMerge = (
  merge: GraphMergeSpec,
  callback: (unitId: string, type: IO, pinId: string) => void
) => {
  forEachValueKey(merge, ({ input, output }, unitId) => {
    forEachValueKey(input || {}, (_, inputId) => {
      callback(unitId, 'input', inputId)
    })
    forEachValueKey(output || {}, (_, outputId) => {
      callback(unitId, 'output', outputId)
    })
  })
}

export const forEachSpecPin = (
  spec: Spec,
  callback: (type: IO, pinId: string, pinSpec: PinSpec) => void
) => {
  const { inputs = {}, outputs = {} } = spec
  forEachValueKey(inputs, (inputSpec, inputId) => {
    callback('input', inputId, inputSpec)
  })
  forEachValueKey(outputs, (outputSpec, outputId) => {
    callback('output', outputId, outputSpec)
  })
}

export const forEachGraphSpecPin = (
  spec: GraphSpec,
  callback: (type: IO, pinId: string, pinSpec: GraphPinSpec) => void
) => {
  forEachGraphSpecPinOfType(spec, 'input', (inputId, inputSpec) => {
    callback('input', inputId, inputSpec)
  })
  forEachGraphSpecPinOfType(spec, 'output', (outputSpec, outputId) => {
    callback('output', outputSpec, outputId)
  })
}

export const forEachGraphSpecPinPlug = (
  spec: GraphSpec,
  callback: (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ) => void
) => {
  forEachGraphSpecPin(
    spec,
    (type: IO, pinId: string, pinSpec: GraphPinSpec) => {
      for (const subPinId in pinSpec.plug ?? {}) {
        const subPinSpec = pinSpec.plug[subPinId]

        callback(type, pinId, pinSpec, subPinId, subPinSpec)
      }
    }
  )
}

export const forEachGraphSpecPinType = (
  spec: GraphSpec,
  type: IO,
  callback: (type: IO, pinId: string, pinSpec: GraphPinSpec) => void
) => {
  forEachGraphSpecPinOfType(spec, type, (pinId, pinSpec) => {
    callback(type, pinId, pinSpec)
  })
}

export const forEachGraphSpecPinOfType = (
  spec: GraphSpec,
  type: IO,
  callback: (pinId: string, pinSpec: GraphPinSpec) => void
) => {
  forEachValueKey(spec[`${type}s`] ?? {}, (pinSpec, pinId) => {
    callback(pinId, pinSpec)
  })
}

export const hasUnit = (spec: GraphSpec, unitId: string): boolean => {
  return !!spec.units?.[unitId]
}

export const hasMerge = (spec: GraphSpec, mergeId: string): boolean => {
  return !!spec.merges?.[mergeId]
}

export const hasMergePin = (
  spec: GraphSpec,
  mergeId: string,
  unitId: string,
  type: IO,
  pinId: string
): boolean => {
  return !!pathOrDefault(spec, ['merges', mergeId, unitId, type, pinId], false)
}

export const hasPinNamed = (spec: Spec, type: IO, pinId: string): boolean => {
  return !!pathOrDefault(spec, [`${type}s`, pinId], false)
}

export const hasPlug = (
  spec: GraphSpec,
  type: IO,
  pinId: string,
  subPinId: string
): boolean => {
  return !!pathOrDefault(spec, [`${type}s`, pinId, 'plug', subPinId], false)
}

export const findMergePlug = (
  spec: GraphSpec,
  type: IO,
  mergeId: string
): GraphPlugOuterSpec | null => {
  let mergePlug: GraphPlugOuterSpec = null

  forEachGraphSpecPinOfType(spec, type, (pinId, pinSpec) => {
    const { plug = {} } = pinSpec

    for (const subPinId in plug) {
      const subPin = plug[subPinId]

      if (subPin.mergeId === mergeId) {
        mergePlug = {
          pinId,
          type,
          subPinId,
        }
      }
    }
  })

  return mergePlug
}

export function getUnitPlugs(
  spec: GraphSpec,
  unit_id: string
): GraphConnectUnitPlugsOpt {
  const plugs: GraphConnectUnitPlugsOpt = {
    input: {},
    output: {},
  }

  forEachGraphSpecPinPlug(
    spec,
    (type, pinId, pinSpec, subPinId, subPinSpec) => {
      if (subPinSpec.unitId === unit_id) {
        pathSet(plugs, [type, pinId], { pinId, subPinId })
      }
    }
  )

  return plugs
}

export const findSpecAtPath = (specs: Specs, spec: Spec, path: string[]) => {
  if (path.length === 0) {
    return spec
  } else {
    const [unitId, ...rest] = path

    const unit = (spec as GraphSpec).units[unitId]

    const unitSpec = getSpec(specs, unit.id)

    return findSpecAtPath(specs, unitSpec, rest)
  }
}

export function makeFullSpecCollapseMap(
  unit_id: string,
  spec: GraphSpec,
  unitIdMap: Dict<string>,
  mergeIdMap: Dict<string>,
  {
    getUnitMerges,
    getMerge,
    getPinMergeId,
  }: {
    getUnitMerges: (unitId: string) => GraphMergesSpec
    getMerge: (mergeId: string) => GraphMergeSpec
    getPinMergeId: (unitId: string, type: IO, pinId: string) => string
  }
): GraphMoveSubGraphData {
  const { units = {}, merges = {}, inputs = {}, outputs = {} } = spec

  const unit_merges = getUnitMerges(unit_id)

  const nextIdMap: GraphMoveSubGraphData['nextIdMap'] = {
    unit: unitIdMap,
    merge: mergeIdMap,
  }
  const nextPinIdMap: GraphMoveSubGraphData['nextPinIdMap'] = {}
  const nextMergePinId: GraphMoveSubGraphData['nextMergePinId'] = {}

  const process_pins = (type: IO, pins: GraphPinsSpec) => {
    for (const pinId in pins) {
      const pin = pins[pinId]

      process_pin(type, pinId, pin)
    }
  }

  const process_pin = (type: IO, pinId: string, pin: GraphPinSpec) => {
    const { plug, ref, defaultIgnored } = pin

    for (const subPinId in plug) {
      const subPinSpec = plug[subPinId]

      if (subPinSpec.unitId && subPinSpec.pinId) {
        forEachPinOnMerges(unit_merges, (mergeId, unitId, type, pinId) => {
          const merge = getMerge(mergeId)

          if (unitId === subPinSpec.unitId && pinId === subPinSpec.pinId) {
            pathSet(nextPinIdMap, [unitId, type], {
              pinId,
              subPinId,
              ref,
              defaultIgnored,
              mergeId,
              merge,
            })
          }
        })
      } else if (subPinSpec.mergeId) {
        const mergeSpec = merges[subPinSpec.mergeId]

        if (isEmptyMerge(mergeSpec)) {
          const mergeId = getPinMergeId(unit_id, type, pinId)

          const merge = getMerge(mergeId)

          const oppositeMerge = clone(merge)

          delete oppositeMerge[unit_id]

          pathSet(nextMergePinId, [subPinSpec.mergeId, type], {
            mergeId,
            pinId,
            subPinSpec: {
              mergeId,
            },
            oppositeMerge,
          })
        }
      }
    }
  }

  process_pins('input', inputs)
  process_pins('output', outputs)

  return {
    nodeIds: {
      unit: keys(units),
      merge: keys(merges),
    },
    nextSpecId: null,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec: {},
    nextUnitPinMergeMap: {},
    nextSubComponentParentMap: {},
    nextSubComponentChildrenMap: {},
    nextSubComponentIndexMap: {},
  }
}
