import { EventEmitter2 } from 'eventemitter2'
import { emptyGraphSpec } from '../spec/emptySpec'
import { ComponentSpec, GraphSpec, PinsSpec, Spec, Specs } from '../types'
import { uuidNotIn } from '../util/id'
import { clone } from '../util/object'
import { removeWhiteSpace } from '../util/string'

export function getSpec(id: string): Spec {
  const spec = globalThis.__specs[id]
  return spec
}

export function getSpecs(): Specs {
  const specs = globalThis.__specs
  return specs
}

export function getComponentSpec(id: string): ComponentSpec {
  const spec = getSpec(id)
  const { component } = spec as GraphSpec
  return component!
}

export function specNameToSpecId(name: string): string {
  return globalThis.__name__to__id[name]
}

export function getSpecByName(name: string): Spec {
  const id = specNameToSpecId(name)
  const spec = getSpec(id)
  return spec
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

export function setSpec(id: string, spec: Spec): void {
  globalThis.__specs[id] = spec

  EMITTER.emit('spec', id, spec)
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

export function newUnitIdInSpecId(id: string, unit_spec_id: string) {
  const spec = getSpec(id) as GraphSpec
  return newUnitIdInSpec(spec, unit_spec_id)
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
