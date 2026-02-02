import { SELF } from '../../constant/SELF'
import { deepSet_ } from '../../deepSet'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keyCount } from '../../system/core/object/KeyCount/f'
import {
  GraphPlugOuterSpec,
  GraphSubPinSpec,
  PinSpec,
  Spec,
  Specs,
} from '../../types'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergeUnitSpec } from '../../types/GraphMergeUnitSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'
import {
  _keyCount,
  deepGetOrDefault,
  deepPush,
  deepSet,
  getObjSingleKey,
  reduceObj,
} from '../../util/object'
import { getSpec, isComponentId } from '../util'

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
  return deepGetOrDefault(
    spec,
    ['units', unitId, type, pinId, 'constant'],
    false
  )
}

export function isUnitPinIgnored(
  spec: GraphSpec,
  unitId: string,
  type: IO,
  pinId: string
): boolean {
  return deepGetOrDefault(
    spec,
    ['units', unitId, type, pinId, 'ignored'],
    false
  )
}

export function isUnitComponent(
  specs: Specs,
  spec: GraphSpec,
  unitId: string
): boolean {
  const { units } = spec

  const unit = units[unitId]

  return isComponentId(specs, unit.id)
}

export const isPinRef = (
  specs: Specs,
  spec: Spec,
  type: IO,
  pinId: string,
  visited: Set<string> = new Set()
) => {
  if (isSelfPin(type, pinId)) {
    return true
  }

  const key = `${spec.id}/${type}/${pinId}`

  if (visited.has(key)) {
    return false
  }

  visited.add(key)

  const pinSpec = deepGetOrDefault(spec, [`${type}s`, pinId], {})

  let { ref } = pinSpec

  if (ref === undefined) {
    const { plug = {} } = pinSpec

    for (const subPinId in plug) {
      const subPin = plug[subPinId]

      if (isSubPinSpecRef(specs, spec as GraphSpec, type, subPin, visited)) {
        ref = true

        break
      }
    }
  }

  return ref
}

export const isMergeRef = (
  specs: Specs,
  spec: GraphSpec,
  mergeId: string,
  visited: Set<string> = new Set()
) => {
  let ref = false

  const merge = getMerge(spec, mergeId)

  forEachPinOnMerge(merge, (unitId, type, pinId) => {
    ref = ref || isUnitPinRef(specs, spec, unitId, type, pinId, visited)
  })

  return ref
}

export const isUnitPinRef = (
  specs: Specs,
  spec: GraphSpec,
  unitId: string,
  type: IO,
  pinId: string,
  visited: Set<string> = new Set()
) => {
  const unit = getUnit(spec, unitId)

  const unitSpec = getSpec(specs, unit.id)

  return isPinRef(specs, unitSpec, type, pinId, visited)
}

export const isSelfPin = (type: IO, pinId: string): boolean => {
  return type === 'output' && pinId === SELF
}

export function getInputNodeId(unitId: string, pinId: string): string {
  return getPinNodeId(unitId, 'input', pinId)
}

export function getOutputNodeId(unitId: string, pinId: string): string {
  return getPinNodeId(unitId, 'output', pinId)
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

export const getExposedPinSpecs = (graph: GraphSpec) => {
  return {
    input: graph.inputs,
    output: graph.outputs,
  }
}

export const getExposePinSpec = (graph: GraphSpec, type: IO, pinId: string) => {
  return deepGetOrDefault(graph, [`${type}s`, pinId], undefined)
}

export const getUnitExposedPins = (
  graph: GraphSpec,
  unitId: string
): IOOf<Dict<{ type: IO; pinId: string; subPinId: string }>> => {
  const pins = {
    input: {},
    output: {},
  }

  forEachGraphSpecPin(graph, (type, pinId, pinSpec) => {
    const { plug = {} } = pinSpec

    for (const subPinId in plug) {
      const subPinSpec = plug[subPinId]

      const {
        unitId: unitId_,
        pinId: pinId_,
        mergeId,
        kind = type,
      } = subPinSpec

      if (unitId_ === unitId) {
        deepSet(pins, [kind, pinId_], {
          type,
          kind,
          pinId,
          subPinId,
        })
      } else if (mergeId) {
        //
      }
    }
  })

  return pins
}

export const getPinSpec = (
  graph: Spec,
  type: IO,
  pinId: string
): GraphPinSpec => {
  return deepGetOrDefault(graph, [`${type}s`, pinId], null)
}

export const getSpecPinIcon = (
  specs: Specs,
  graph: Spec,
  type: IO,
  pinId: string
): string | null => {
  let pin_icon_name: string | null = null

  if (isSelfPin(type, pinId)) {
    return graph.metadata.icon
  }

  const pin_spec = getPinSpec(graph, type, pinId)

  const { plug, icon } = pin_spec

  if (icon) {
    pin_icon_name = icon
  } else if (plug) {
    const sub_pin_id = getObjSingleKey(plug)

    if (!sub_pin_id) {
      return null
    }

    const sub_pin = plug[sub_pin_id]

    const { unitId, pinId, mergeId, kind = type } = sub_pin
    const { units = {}, merges = {} } = graph as GraphSpec

    let plugUnitId: string
    let plugPinId: string

    if (unitId && pinId) {
      plugUnitId = unitId
      plugPinId = pinId
    } else {
      const merge = merges[mergeId]

      for (const unitId in merge) {
        const mergeUnit = merge[unitId]

        const { output = {} } = mergeUnit

        for (const output_id in output) {
          plugUnitId = unitId
          plugPinId = output_id

          break
        }
      }
    }

    const unit = units[plugUnitId]

    if (unit) {
      const { id } = unit

      const unit_spec = getSpec(specs, id)

      if (type === 'output' && pinId === SELF) {
        pin_icon_name = unit_spec.metadata?.icon ?? null
      } else {
        pin_icon_name = unit_spec?.[`${type}s`][plugPinId]?.icon ?? null
      }

      if (!pin_icon_name) {
        return getSpecPinIcon(specs, unit_spec, kind, plugPinId)
      }
    }
  } else {
    const { icon } = pin_spec

    pin_icon_name = icon || 'triangle'
  }

  return pin_icon_name
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

      deepSet(plugs, [type, pinId, subPinId], plug)
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
  return deepGetOrDefault(graph, [`${type}s`, pinId, 'plug', subPinId], null)
}

export const findPinMergeId = (
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
  return keyCount(deepGetOrDefault(spec, [`${type}s`, pinId, 'plug'], {}))
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

export const getMergePinTypeCount = (
  merge: GraphMergeSpec,
  type: IO
): number => {
  return reduceObj(
    merge,
    (count, mergeUnit) => {
      return count + getMergeUnitTypePinCount(mergeUnit, type)
    },
    0
  )
}

export const getMergeTypePinCount = (
  merge: GraphMergeSpec,
  type: IO
): number => {
  return reduceObj(
    merge,
    (count, mergeUnit) => {
      return count + getMergeUnitTypePinCount(mergeUnit, type)
    },
    0
  )
}

export const getMergeUnitPinCount = (mergeUnit: GraphMergeUnitSpec): number => {
  return (
    getMergeUnitTypePinCount(mergeUnit, 'input') +
    getMergeUnitTypePinCount(mergeUnit, 'output')
  )
}

export const getMergeUnitTypePinCount = (
  mergeUnit: GraphMergeUnitSpec,
  type: IO
): number => {
  const { [type]: pins = {} } = mergeUnit

  const pinCount = _keyCount(pins)

  return pinCount
}

export const forEachPinOnMerges = <T>(
  merges: Dict<Dict<IOOf<Dict<T>>>>,
  callback: (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    data: T
  ) => void
) => {
  forEachValueKey(merges || {}, (merge, mergeId) => {
    forEachPinOnMerge(merge, (unitId, type, pinId, data) =>
      callback(mergeId, unitId, type, pinId, data)
    )
  })
}

export const forEachPinOnMerge = <T>(
  merge: Dict<IOOf<Dict<T>>>,
  callback: (unitId: string, type: IO, pinId: string, data: T) => void
) => {
  forEachValueKey(merge, ({ input, output }, unitId) => {
    forEachValueKey(input || {}, (_, inputId) => {
      callback(unitId, 'input', inputId, _)
    })
    forEachValueKey(output || {}, (_, outputId) => {
      callback(unitId, 'output', outputId, _)
    })
  })
}

export const forEachInputOnMerge = <T>(
  merge: Dict<IOOf<Dict<T>>>,
  callback: (unitId: string, pinId: string, data: T) => void
) => {
  forEachValueKey(merge, ({ input }, unitId) => {
    forEachValueKey(input || {}, (_, inputId) => {
      callback(unitId, inputId, _)
    })
  })
}

export const forEachOutputOnMerge = <T>(
  merge: Dict<IOOf<Dict<T>>>,
  callback: (unitId: string, type: IO, pinId: string, data: T) => void
) => {
  forEachValueKey(merge, ({ output }, unitId) => {
    forEachValueKey(output || {}, (_, outputId) => {
      callback(unitId, 'output', outputId, _)
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
  return !!deepGetOrDefault(
    spec,
    ['merges', mergeId, unitId, type, pinId],
    false
  )
}

export const hasPin = (spec: Spec, type: IO, pinId: string): boolean => {
  return !!deepGetOrDefault(spec, [`${type}s`, pinId], false)
}

export const hasPlug = (
  spec: GraphSpec,
  type: IO,
  pinId: string,
  subPinId: string
): boolean => {
  return !!deepGetOrDefault(spec, [`${type}s`, pinId, 'plug', subPinId], false)
}

export const findMergePlugOfType = (
  spec: GraphSpec,
  type: IO,
  mergeId: string
): GraphPlugOuterSpec[] => {
  const mergePlugs = findMergePlugs(spec, mergeId)

  const mergePlugOfType = mergePlugs[type]

  return mergePlugOfType
}

export const findMergePlugs = (
  spec: GraphSpec,
  mergeId: string
): IOOf<GraphPlugOuterSpec[]> => {
  const mergePlugs: IOOf<GraphPlugOuterSpec[]> = {
    input: [],
    output: [],
  }

  forEachGraphSpecPin(spec, (type, pinId, pinSpec) => {
    const { plug = {} } = pinSpec

    for (const subPinId in plug) {
      const subPinSpec = plug[subPinId]

      if (subPinSpec.mergeId === mergeId) {
        mergePlugs[type].push({
          pinId,
          type,
          subPinId,
          pinSpec,
          subPinSpec,
        })
      }
    }
  })

  return mergePlugs
}

export const countMergePlugs = (spec: GraphSpec, mergeId: string): number => {
  const mergePlugs = findMergePlugs(spec, mergeId)

  const count = mergePlugs.input.length + mergePlugs.output.length

  return count
}

export const findUnitPinPlug = (
  spec: GraphSpec,
  unitId: string,
  type: IO,
  pinId: string
): GraphPlugOuterSpec | null => {
  let pinPlug: GraphPlugOuterSpec = null

  forEachGraphSpecPinOfType(spec, type, (_pinId, pinSpec) => {
    const { plug = {} } = pinSpec

    for (const subPinId in plug) {
      const subPinSpec = plug[subPinId]

      if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
        pinPlug = {
          pinId: _pinId,
          type,
          subPinId,
          pinSpec,
          subPinSpec,
        }
      }
    }
  })

  return pinPlug
}

export function findUnitPlugs(spec: GraphSpec, unitId: string): GraphUnitPlugs {
  const unitPlugs: GraphUnitPlugs = {
    input: {},
    output: {},
  }

  forEachGraphSpecPinPlug(
    spec,
    (type, pinId, pinSpec, subPinId, subPinSpec) => {
      if (subPinSpec.unitId === unitId) {
        deepPush(unitPlugs, [subPinSpec.kind ?? type, subPinSpec.pinId], {
          type,
          pinId,
          pinSpec,
          subPinId,
          subPinSpec,
        })
      }
    }
  )

  return unitPlugs
}

export const findSpecAtPath = (
  specs: Specs,
  spec: Spec,
  path: string[]
): GraphSpec => {
  if (path.length === 0) {
    return spec as GraphSpec
  } else {
    const [unitId, ...rest] = path

    const unitSpec = getUnitSpec(specs, spec, unitId)

    return findSpecAtPath(specs, unitSpec, rest)
  }
}

export const getUnitSpec = (specs: Specs, spec: Spec, unitId: string): Spec => {
  const unit = (spec as GraphSpec).units[unitId]

  const unitSpec = getSpec(specs, unit.id)

  return unitSpec
}

export const findUnitAtPath = (
  specs: Specs,
  spec: Spec,
  path: string[],
  unit?: GraphUnitSpec
): GraphUnitSpec => {
  if (path.length === 0) {
    return unit
  } else {
    const [unitId, ...rest] = path

    const unit = (spec as GraphSpec).units[unitId] as GraphUnitSpec

    const unitSpec = getSpec(specs, unit.id)

    return findUnitAtPath(specs, unitSpec, rest, unit)
  }
}

export const shouldExposePin = (
  type: IO,
  pinId: string,
  pinSpec: GraphPinSpec,
  subPinId: string,
  subPinSpec: GraphSubPinSpec,
  merged: boolean,
  outerPlug: GraphPlugOuterSpec | null = null
) => {
  if (merged || outerPlug) {
    return false
  }

  if (keyCount(pinSpec.plug ?? {}) > 1) {
    return true
  }

  if (subPinSpec.pinId === pinId) {
    return false
  }

  return true
}

export function isSubPinSpecRef(
  specs: Specs,
  spec: GraphSpec,
  type: IO,
  subPinSpec: GraphSubPinSpec,
  visited: Set<string> = new Set()
) {
  let ref = false

  if (subPinSpec.unitId && subPinSpec.pinId) {
    const { kind = type } = subPinSpec

    const unit = spec.units[subPinSpec.unitId]

    const unitSpec = getSpec(specs, unit.id)

    ref = isPinRef(specs, unitSpec, kind, subPinSpec.pinId, visited)
  } else if (subPinSpec.mergeId) {
    const merge = spec.merges[subPinSpec.mergeId]

    forEachPinOnMerge(merge, (unitId, type, pinId) => {
      const unit = spec.units[unitId]

      const unitSpec = getSpec(specs, unit.id)

      if (ref === true) {
        return
      }

      ref = isPinRef(specs, unitSpec, type, pinId, visited)
    })
  }

  return ref
}

export function isPinSpecRef(
  specs: Specs,
  spec: GraphSpec,
  type: IO,
  pinSpec: GraphPinSpec,
  visited: Set<string>
) {
  const { plug = {}, ref } = pinSpec

  if (ref !== undefined) {
    return ref
  }

  for (const subPinId in plug) {
    const subPinSpec = plug[subPinId]

    if (isSubPinSpecRef(specs, spec, type, subPinSpec, visited)) {
      return true
    }
  }

  return false
}

export function findUnitMerges(
  spec: GraphSpec,
  unitId: string
): GraphMergesSpec {
  const { merges } = spec

  const unit_merges: GraphMergesSpec = {}

  for (const mergeId in merges) {
    const merge = merges[mergeId]

    if (merge[unitId]) {
      unit_merges[mergeId] = merge
    }
  }

  return unit_merges
}

export function buildUnitPinToPlug(
  source: GraphSpec,
  unitId: string
): IOOf<Dict<GraphPlugOuterSpec>> {
  const pinToPlug: IOOf<Dict<GraphPlugOuterSpec>> = {}

  forEachGraphSpecPin(
    source,
    (type: IO, pinId: string, pinSpec: GraphPinSpec) => {
      const { plug = {} } = pinSpec

      for (const subPinId in plug) {
        const subPinSpec = plug[subPinId]

        if (subPinSpec.unitId && subPinSpec.pinId) {
          if (subPinSpec.unitId === unitId) {
            deepSet_(pinToPlug, [subPinSpec.kind ?? type, subPinSpec.pinId], {
              type,
              pinId,
              pinSpec,
              subPinSpec,
            })
          }
        } else if (subPinSpec.mergeId) {
          const merge = getMerge(source, subPinSpec.mergeId)

          forEachPinOnMerge(merge, (unitId_, type_, pinId_) => {
            if (unitId_ === unitId) {
              deepSet_(pinToPlug, [type_, pinId_], {
                type,
                pinId,
                pinSpec,
                subPinSpec,
              })
            }
          })
        }
      }
    }
  )

  return pinToPlug
}

export function buildUnitPinToMerge(
  source: GraphSpec,
  unitId: string
): IOOf<Dict<string>> {
  const pinToMerge: IOOf<Dict<string>> = {}

  const merges = findUnitMerges(source, unitId)

  forEachPinOnMerges(merges, (mergeId, unitId_, type_, pinId_) => {
    if (unitId_ === unitId) {
      deepSet_(pinToMerge, [type_, pinId_], mergeId)
    }
  })

  return pinToMerge
}

export function getUnit(spec: GraphSpec, unitId: string): GraphUnitSpec {
  const { units } = spec

  const unit = units[unitId]

  return unit
}

export function getMerge(spec: GraphSpec, mergeId: string): GraphMergeSpec {
  const { merges = {} } = spec

  const merge = merges[mergeId]

  return merge
}

export function getUnitPinDatum(
  spec: GraphSpec,
  unitId: string,
  type: IO,
  pinId: string
) {
  return deepGetOrDefault(
    spec,
    ['units', unitId, type, pinId, 'data'],
    undefined
  )
}

export function getUnitInputDatum(
  spec: GraphSpec,
  unitId: string,
  pinId: string
) {
  return getUnitPinDatum(spec, unitId, 'input', pinId)
}

export function isEmptyMerge(mergeSpec: GraphMergeSpec) {
  return getMergePinCount(mergeSpec) === 0
}

export const hasPinId = (spec: Spec, type: IO, pinId: string): boolean => {
  return !!(spec[`${type}s`] || {})[pinId]
}

export const hasDatum = (spec: GraphSpec, datumId: string): boolean => {
  return !!spec.data?.[datumId]
}
