import { UNTITLED } from '../constant/STRING'
import { emptyGraphSpec } from '../spec/emptySpec'
import { System } from '../system'
import { keyCount } from '../system/core/object/KeyCount/f'
import { keys } from '../system/f/object/Keys/f'
import {
  ComponentSpec,
  GraphComponentSpec,
  GraphSpecs,
  PinsSpec,
  Spec,
  Specs,
} from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { IO } from '../types/IO'
import { uuidNotIn } from '../util/id'
import { clone, pathOrDefault } from '../util/object'
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
  return pathOrDefault(specs, [id, `${type}s`, pinId, 'plug'], {})
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

export function sameSpec(a_spec: GraphSpec, b_spec: GraphSpec): boolean {
  // TODO
  return false
}

export function isSystemSpecId(specs: Specs, specId: string): boolean {
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

export function __injectSpecs(
  system: System,
  new_specs: GraphSpecs
): Dict<string> {
  const map_spec_id: Dict<string> = {}

  for (const spec_id in new_specs) {
    const spec = new_specs[spec_id]

    let new_spec_id = spec_id
    let has_spec = false

    while (system.hasSpec(new_spec_id)) {
      new_spec_id = system.newSpecId()
      has_spec = true
    }

    if (has_spec) {
      map_spec_id[spec_id] = new_spec_id
    }

    system.setSpec(spec_id, spec)
  }
  return map_spec_id
}

export function injectSpecs(specs: Specs, new_specs: GraphSpecs): Dict<string> {
  const map_spec_id: Dict<string> = {}

  for (const spec_id in new_specs) {
    const spec = new_specs[spec_id]

    let new_spec_id = spec_id
    let has_spec = false

    while (specs[new_spec_id]) {
      new_spec_id = newSpecId(specs)
      has_spec = true
    }

    if (has_spec) {
      map_spec_id[spec_id] = new_spec_id
    }

    specs[spec_id] = spec
  }

  return map_spec_id
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

        const { unitId, pinId, mergeId } = subPin

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
