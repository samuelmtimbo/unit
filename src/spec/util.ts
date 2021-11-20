import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { GraphMergeSpec, GraphMergesSpec, GraphMergeUnitSpec } from '../types'
import { reduceObj, _keyCount } from '../util/object'

export function isValidSpecName(name: string) {
  return !!/^[A-Za-z_ ][A-Za-z\d_ ]*$/g.exec(name)
}

export function getPinNodeId(
  unitId: string,
  type: 'input' | 'output',
  pinId: string
): string {
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

export function getMergePinNodeId(
  mergeId: string,
  type: 'input' | 'output'
): string {
  return `${mergeId}/${type}`
}

export function oppositePinKind(kind: 'input' | 'output'): 'input' | 'output' {
  return kind === 'input' ? 'output' : 'input'
}

export const findMergePin = (
  merge: GraphMergeSpec,
  type: 'input' | 'output'
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
  callback: (
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) => void
) => {
  forEachKeyValue(merges || {}, (merge, mergeId) => {
    forEachPinOnMerge(merge, (unitId, type, pinId) =>
      callback(mergeId, unitId, type, pinId)
    )
  })
}

export const forEachPinOnMerge = (
  merge: GraphMergeSpec,
  callback: (unitId: string, type: 'input' | 'output', pinId: string) => void
) => {
  forEachKeyValue(merge, ({ input, output }, unitId) => {
    forEachKeyValue(input || {}, (_, inputId) => {
      callback(unitId, 'input', inputId)
    })
    forEachKeyValue(output || {}, (_, outputId) => {
      callback(unitId, 'output', outputId)
    })
  })
}
