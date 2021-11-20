import { EventEmitter2 } from 'eventemitter2'
import { emptyGraphSpec } from '../spec/emptySpec'
import {
  ComponentSpec,
  GraphComponentSpec,
  GraphSpec,
  GraphSpecs,
  PinsSpec,
  Spec,
  Specs,
} from '../types'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { uuidNotIn } from '../util/id'
import { clone, isEmptyObject } from '../util/object'
import { removeWhiteSpace } from '../util/string'

export function getSpec(id: string): Spec {
  const spec = globalThis.__specs[id]
  return spec
}

export function getGraphSpec(id: string): GraphSpec {
  const spec = globalThis.__specs[id] as GraphSpec
  return spec
}

export function getSpecs(): Specs {
  const specs = globalThis.__specs
  return specs
}

export function hasSpec(id: string): boolean {
  const spec = globalThis.__specs[id]
  return !!spec
}

export function getComponentSpec(id: string): ComponentSpec {
  const spec = getSpec(id)
  const { component } = spec as GraphSpec
  return component!
}

export function getSpecInputs(id: string): PinsSpec {
  const spec = getSpec(id)
  const { inputs = {} } = spec
  return inputs
}

export function getSpecOutputs(id: string): PinsSpec {
  const spec = getSpec(id)
  const { outputs = {} } = spec
  return outputs
}

export function getSpecInputCount(id: string): number {
  const inputs = getSpecInputs(id)
  const inputCount = Object.keys(inputs || {}).length
  return inputCount
}

export function getSpecOutputCount(id: string): number {
  const outputs = getSpecOutputs(id)
  const outputCount = Object.keys(outputs || {}).length
  return outputCount
}

export function emptySpec(init: Partial<GraphSpec> = {}): GraphSpec {
  const newSpec: GraphSpec = clone({ ...emptyGraphSpec, ...init }) as GraphSpec
  return newSpec
}

export const EMITTER = new EventEmitter2()

export function setSpec(id: string, spec: GraphSpec): void {
  // console.log('setSpec', id, spec)
  const is_new = !globalThis.__specs[id]

  globalThis.__specs[id] = spec

  if (is_new) {
    EMITTER.emit('add', id, spec)
  } else {
    EMITTER.emit('set', id, spec)
  }
}

export function deleteSpec(id: string): void {
  // console.log('deleteSpec', id)
  delete globalThis.__specs[id]

  EMITTER.emit('delete', id)
}

export function addSpecListener(
  name: string,
  listener: (id: string, spec: GraphSpec) => void
): Unlisten {
  EMITTER.addListener(name, listener)
  return () => {
    EMITTER.removeListener(name, listener)
  }
}

export function addAddSpecListener(
  listener: (id: string, spec: GraphSpec) => void
): Unlisten {
  return addSpecListener('add', listener)
}

export function addSetSpecListener(
  listener: (id: string, spec: GraphSpec) => void
): Unlisten {
  return addSpecListener('set', listener)
}

export function addDeleteSpecListener(
  listener: (id: string) => void
): Unlisten {
  return addSpecListener('delete', listener)
}

export function getSpecName(id: string): string {
  const spec = globalThis.__specs[id]
  const { name } = spec
  return name
}

export function getSpecTitle(id: string): string {
  return getSpecName(id)
}

export function newSpecId(): string {
  const specs = getSpecs()
  const specId = uuidNotIn(specs)
  return specId
}

export function newUnitIdInSpecId(
  id: string,
  unit_spec_id: string,
  blacklist?: Set<string>
) {
  const spec = getSpec(id) as GraphSpec
  return newUnitIdInSpec(spec, unit_spec_id, blacklist)
}

export function newUnitIdInSpec(
  spec: GraphSpec,
  unit_spec_id: string,
  blacklist: Set<string> = new Set()
): string {
  const unit_spec = getSpec(unit_spec_id)
  const { name } = unit_spec
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

export function isSystemSpecId(spec_id: string): boolean {
  const spec = getSpec(spec_id)
  const { system } = spec
  return system
}

export function injectSpecs(new_specs: GraphSpecs): Dict<string> {
  const map_spec_id: Dict<string> = {}

  for (const spec_id in new_specs) {
    const spec = new_specs[spec_id]

    let new_spec_id = spec_id

    if (hasSpec(spec_id)) {
      // TODO
      // treat same spec with different spec id
      new_spec_id = newSpecId()
      map_spec_id[spec_id] = new_spec_id
    }

    setSpec(spec_id, spec)
  }

  return map_spec_id
}

export function getSubComponentParentId(
  spec: GraphSpec,
  subComponentId: string
): string | null {
  const { component = {} } = spec

  const { children = [], subComponents = {} } = component

  const is_root_child = children.includes(subComponentId)

  if (is_root_child) {
    return null
  } else {
    // PERFORMANCE
    for (const sub_component_id in subComponents) {
      const sub_component = subComponents[sub_component_id]

      const { children: sub_component_children } = sub_component

      const is_sub_component_child =
        sub_component_children.includes(subComponentId)
      if (is_sub_component_child) {
        return sub_component_id
      }
    }
  }

  return null
}

export function isComponent(id: string): boolean {
  const componentSpec = getComponentSpec(id)
  return isComponentSpec(componentSpec)
}

export function isComponentSpec(componentSpec: GraphComponentSpec): boolean {
  return componentSpec && !isEmptyObject(componentSpec)
}
