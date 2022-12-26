import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphMergeUnitSpec,
  GraphPinSpec,
  GraphPlugOuterSpec,
  GraphSpec,
  PinSpec,
  Spec,
} from '../types'
import { IO } from '../types/IO'
import { reduceObj, _keyCount } from '../util/object'

export function isValidSpecName(name: string) {
  return !!/^[A-Za-z_ ][A-Za-z\d_ ]*$/g.exec(name)
}

export function getPinNodeId(unitId: string, type: IO, pinId: string): string {
  return `${unitId}/${type}/${pinId}`
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

export const findMergePin = (
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

export const forEachGraphSpecPinOfType = (
  spec: GraphSpec,
  type: IO,
  callback: (pinId: string, pinSpec: GraphPinSpec) => void
) => {
  forEachValueKey(spec[`${type}s`] ?? {}, (pinSpec, pinId) => {
    callback(pinId, pinSpec)
  })
}

export const specHasUnit = (spec: GraphSpec, unitId: string): boolean => {
  return !!spec.units?.[unitId]
}

export const specHasMerge = (spec: GraphSpec, mergeId: string): boolean => {
  return !!spec.merges?.[mergeId]
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
