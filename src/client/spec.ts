import { UNTITLED } from '../constant/STRING'
import { emptyGraphSpec } from '../spec/emptySpec'
import { getMergePinCount } from '../spec/util/spec'
import { keyCount } from '../system/core/object/KeyCount/f'
import isEqual from '../system/f/comparison/Equals/f'
import deepMerge from '../system/f/object/DeepMerge/f'
import { keys } from '../system/f/object/Keys/f'
import {
  ComponentSpec,
  GraphComponentSpec,
  PinsSpec,
  Spec,
  Specs,
} from '../types'
import { GraphPinSpec } from '../types/GraphPinSpec'
import { GraphSpec } from '../types/GraphSpec'
import { IO } from '../types/IO'
import { clone } from '../util/clone'
import { uuidNotIn } from '../util/id'
import { deepGetOrDefault } from '../util/object'
import { removeWhiteSpace } from '../util/string'

export function getSpec(specs: Specs, id: string): Spec {
  const spec = specs[id]
  return spec
}

export function getGraphSpec(specs: Specs, id: string): GraphSpec {
  const spec = specs[id] as GraphSpec
  return spec
}

export function getSpecs(specs: Specs): Specs {
  return specs
}

export function hasSpec(specs: Specs, id: string): boolean {
  const spec = specs[id]
  return !!spec
}

export function getComponentSpec(specs: Specs, id: string): ComponentSpec {
  const spec = getSpec(specs, id)
  const { component = {} } = spec
  return component
}

export function getSpecPins(specs: Specs, id: string, type: IO): PinsSpec {
  const spec = getSpec(specs, id)
  const pins = spec[`${type}s`] || {}
  return pins
}

export function getSpecPinPlugs(
  specs: Specs,
  id: string,
  type: IO,
  pinId: string
): PinsSpec {
  return deepGetOrDefault(specs, [id, `${type}s`, pinId, 'plug'], {})
}

export function getSpecInputs(specs: Specs, id: string): PinsSpec {
  const spec = getSpec(specs, id)
  const { inputs = {} } = spec
  return inputs
}

export function getSpecOutputs(specs: Specs, id: string): PinsSpec {
  const spec = getSpec(specs, id)
  const { outputs = {} } = spec
  return outputs
}

export function getSpecPinPlugCount(
  specs: Specs,
  id: string,
  type: IO,
  pinId: string
): number {
  const plugs = getSpecPinPlugs(specs, id, type, pinId)
  const count = keys(plugs || {}).length
  return count
}

export function getSpecPinCount(specs: Specs, id: string, type: IO): number {
  const pins = getSpecPins(specs, id, type)
  const inputCount = keys(pins || {}).length
  return inputCount
}

export function getSpecInputCount(specs: Specs, id: string): number {
  const inputs = getSpecInputs(specs, id)
  const inputCount = keys(inputs || {}).length
  return inputCount
}

export function getSpecOutputCount(specs: Specs, id: string): number {
  const outputs = getSpecOutputs(specs, id)
  const outputCount = keys(outputs || {}).length
  return outputCount
}

export function emptySpec(init: Partial<GraphSpec> = {}): GraphSpec {
  const newSpec: GraphSpec = clone({
    ...emptyGraphSpec(),
    ...init,
  }) as GraphSpec
  return newSpec
}

export function emptyShell(
  from: GraphSpec,
  init: Partial<GraphSpec> = {}
): GraphSpec {
  const newSpec: GraphSpec = clone({
    ...emptyGraphSpec(),
    ...init,
  }) as GraphSpec

  return newSpec
}

export function getSpecName(specs: Specs, id: string): string {
  const spec = specs[id]
  const { name } = spec
  return name
}

export function getSpecTitle(specs: Specs, id: string): string {
  return getSpecName(specs, id)
}

export function newSpecId(specs: Specs): string {
  const specId = uuidNotIn(specs)
  return specId
}

export function newUnitIdInSpecId(
  specs: Specs,
  id: string,
  unit_spec_id: string,
  blacklist?: Set<string>
) {
  const spec = getSpec(specs, id) as GraphSpec
  return newUnitId(specs, spec, unit_spec_id, blacklist)
}

export function newUnitId(
  specs: Specs,
  spec: GraphSpec,
  unit_spec_id: string,
  blacklist: Set<string> = new Set()
): string {
  const unit_spec = getSpec(specs, unit_spec_id)

  const { name = UNTITLED } = unit_spec

  return newUnitIdFromName(spec, name, blacklist)
}

export function newUnitIdFromName(
  spec: GraphSpec,
  name: string,
  blacklist: Set<string> = new Set()
): string {
  const init_new_unit_id = removeWhiteSpace(name)
  let new_unit_id: string = init_new_unit_id
  let i = 0
  while (hasUnitId(spec, new_unit_id) || blacklist.has(new_unit_id)) {
    new_unit_id = init_new_unit_id + i
    i++
  }
  return new_unit_id
}

export function newMergeIdInSpec(
  spec: GraphSpec,
  blacklist: Set<string> = new Set()
): string {
  let i = 0
  let new_merge_id = `${i}`
  while (hasMergeId(spec, new_merge_id) || blacklist.has(new_merge_id)) {
    i++
    new_merge_id = `${i}`
  }
  return new_merge_id
}

export function hasUnitId(spec: GraphSpec, unit_id: string): boolean {
  const { units = {} } = spec
  const has = !!units[unit_id]
  return has
}

export function hasMergeId(spec: GraphSpec, merge_id: string): boolean {
  const { merges = {} } = spec
  const has = !!merges[merge_id]
  return has
}

export function sameSpec(a: GraphSpec, b: GraphSpec): boolean {
  a = deepMerge(emptySpec(), a)
  b = deepMerge(emptySpec(), b)

  if (a.name !== b.name) {
    return false
  }

  if (!sameUnits(a, b)) {
    return false
  }

  if (!sameMerges(a, b)) {
    return false
  }

  if (!sameInputs(a, b)) {
    return false
  }

  if (!sameOutputs(a, b)) {
    return false
  }

  if (!sameMetadata(a, b)) {
    return false
  }

  return true
}

export function sameUnits(a: GraphSpec, b: GraphSpec): boolean {
  if (keyCount(a.units) !== keyCount(b.units)) {
    return false
  }

  for (const unitId in a.units) {
    if (!b.units[unitId]) {
      return false
    }

    a.units[unitId] = deepMerge({ input: {} }, a.units[unitId])
    b.units[unitId] = deepMerge({ input: {} }, b.units[unitId])

    for (const inputId in a.units[unitId].input) {
      const aInput = a.units[unitId].input[inputId] ?? {}
      const bInput = b.units[unitId].input[inputId] ?? {}

      if (!!aInput.constant !== !!bInput.constant) {
        return false
      }

      if (!isEqual(aInput.data, bInput.data)) {
        return false
      }
    }
  }

  return true
}

export function sameMerges(a: GraphSpec, b: GraphSpec): boolean {
  for (const mergeId in a.merges) {
    if (!b.merges[mergeId]) {
      return false
    }

    const aMergePinCount = getMergePinCount(a.merges[mergeId])
    const bMergePinCount = getMergePinCount(b.merges[mergeId])

    if (aMergePinCount !== bMergePinCount) {
      return false
    }

    const merge = a.merges[mergeId]

    for (const unitId in merge) {
      if (!b.merges[mergeId][unitId]) {
        return false
      }

      for (const type in merge[unitId]) {
        for (const pinId in merge[unitId][type]) {
          if (!b.merges[mergeId]?.[unitId]?.[type]?.[pinId]) {
            return false
          }
        }
      }
    }
  }

  return true
}

export function sameInputs(a: GraphSpec, b: GraphSpec): boolean {
  return samePins(a, b, 'input')
}

export function sameOutputs(a: GraphSpec, b: GraphSpec): boolean {
  return samePins(a, b, 'output')
}

export function samePins(a: GraphSpec, b: GraphSpec, type: IO): boolean {
  for (const pinId in a[`${type}s`]) {
    let aPin = a[`${type}s`][pinId] ?? {}
    let bPin = b[`${type}s`][pinId] ?? {}

    if (!bPin) {
      return false
    }

    if (!samePin(aPin, bPin)) {
      return false
    }
  }

  return true
}

export function samePin(a: GraphPinSpec, b: GraphPinSpec): boolean {
  a = deepMerge({ plug: {} }, a)
  b = deepMerge({ plug: {} }, b)

  const { plug } = a

  for (const subPinId in plug) {
    const aSubPin = a.plug[subPinId]
    const bSubPin = b.plug[subPinId]

    if (!bSubPin) {
      return false
    }

    if (!isEqual(aSubPin, bSubPin)) {
      return false
    }
  }

  return true
}

export function sameMetadata(a: GraphSpec, b: GraphSpec): boolean {
  let aMetadata = a.metadata ?? {}
  let bMetadata = b.metadata ?? {}

  aMetadata = deepMerge({ description: '', icon: null }, aMetadata)
  bMetadata = deepMerge({ description: '', icon: null }, bMetadata)

  if (!isEqual(aMetadata, bMetadata)) {
    return false
  }

  return true
}

export function isInternalSpecId(specId: string): boolean {
  return specId.startsWith('_')
}

export function isSystemSpecId(specs: Specs, specId: string): boolean {
  if (isInternalSpecId(specId)) {
    return true
  }

  const spec = getSpec(specs, specId)

  const { system } = spec

  return system
}

export function isSystemSpec(spec: Spec): boolean {
  const { system } = spec

  return system
}

export function isEmptySpec(spec: GraphSpec): boolean {
  const { units = {}, base } = spec

  if (base) {
    return false
  }

  const unitCount = keys(units).length

  const empty = unitCount === 0

  return empty
}

export function getSpecRenderById(
  specs: Specs,
  id: string
): boolean | undefined {
  const spec = getSpec(specs, id)

  return getSpecRender(spec)
}

export function getSpecRender(spec: Spec): boolean | undefined {
  const { render } = spec

  return render
}

export function isComponentId(specs: Specs, id: string): boolean {
  return (
    getSpecRenderById(specs, id) ?? hasSubComponents(specs[id] as GraphSpec)
  )
}

export function isComponentSpec(spec: Spec): boolean {
  return getSpecRender(spec) ?? hasSubComponents(spec as GraphSpec)
}

export function hasSubComponent(
  spec: GraphSpec,
  subComponentId: string
): boolean {
  const { component = {} } = spec
  const { subComponents = {} } = component

  return !!subComponents[subComponentId]
}

export function hasSubComponents(spec: GraphSpec): boolean {
  const { component = {} } = spec
  const { subComponents = {} } = component

  return keyCount(subComponents) > 0
}

export function shouldRender(componentSpec: GraphComponentSpec): boolean {
  return !!componentSpec.children && componentSpec.children.length > 0
}

export function findInputDataExamples(
  specs: Specs,
  spec_id: string,
  input_id: string
): string[] {
  const spec = getSpec(specs, spec_id)

  const { units, merges, inputs, base } = spec as GraphSpec

  const input = inputs[input_id]

  const { metadata = {} } = input

  const { examples = [] } = metadata

  if (examples.length > 0) {
    return examples
  } else {
    if (base) {
      return []
    } else {
      const { plug } = input

      for (const subPinId in plug) {
        const subPin = plug[subPinId]

        const { unitId, kind = 'input', pinId, mergeId } = subPin

        if (kind !== 'input') {
          continue
        }

        if (unitId && pinId) {
          const unit = units[unitId]

          const unit_examples = findInputDataExamples(specs, unit.id, pinId)

          if (unit_examples.length > 0) {
            return unit_examples
          }
        } else if (mergeId) {
          const merge = merges[mergeId]

          for (const unitId in merge) {
            const mergeUnit = merge[unitId]

            const { input = {} } = mergeUnit

            const unit = units[unitId]

            for (const inputId in input) {
              const unit_examples = findInputDataExamples(
                specs,
                unit.id,
                inputId
              )

              if (unit_examples.length > 0) {
                return unit_examples
              }
            }
          }
        }
      }
    }
  }

  return []
}
