import { unitBundleSpec } from '../bundle'
import { Graph } from '../Class/Graph'
import { System } from '../system'
import { Classes, PinSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphBundle, GraphClass } from '../types/GraphClass'
import { GraphSpec } from '../types/GraphSpec'
import { GraphUnitPinSpec } from '../types/GraphUnitPinSpec'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { io } from '../types/IOOf'
import { weakMerge } from '../weakMerge'
import { bundleClass } from './bundleClass'
import { getSpec } from './util'

export function fromSpec<I extends Dict<any> = any, O extends Dict<any> = any>(
  spec: GraphSpec,
  specs_: Specs,
  classes: Classes = {},
  branch: { [path: string]: true } = {}
): GraphBundle<I, O> {
  const Class = classFromSpec<I, O>(spec, specs_, classes, branch)

  const { id } = spec

  if (!id) {
    throw new Error('spec id is required')
  }

  const bundle = unitBundleSpec({ id }, weakMerge(specs_, { [id]: spec }))

  const Bundle = bundleClass(Class, bundle, specs_)

  return Bundle
}

export function applyUnitDefaultIgnored(
  unitSpec: GraphUnitSpec,
  specs: Specs
): void {
  unitSpec.input = unitSpec.input || {}
  unitSpec.output = unitSpec.output || {}

  const { id } = unitSpec

  const spec = getSpec(specs, id)

  function setIgnored(unitPinSpec: GraphUnitPinSpec, pinSpec: PinSpec): void {
    const { ignored } = unitPinSpec

    if (ignored === undefined) {
      const { defaultIgnored } = pinSpec

      if (defaultIgnored === true) {
        unitPinSpec.ignored = true
      }
    }
  }

  io((type) => {
    const pins = spec[`${type}s`] ?? {}
    const pin = unitSpec[type]

    for (const pinId in pins) {
      const pinSpec = pins[pinId]

      pin[pinId] = pin[pinId] || {}

      const unitPinSpec = pin[pinId]

      setIgnored(unitPinSpec, pinSpec)
    }
  })
}

export function applyDefaultIgnored(spec: GraphSpec, specs: Specs) {
  const { name, units } = spec

  for (const unitId in units) {
    const unitSpec: GraphUnitSpec = units[unitId]
  }
}

export function classFromSpec<I, O>(
  spec: GraphSpec,
  specs: Specs,
  classes: Classes,
  branch: { [path: string]: true } = {}
): GraphClass<I, O> {
  applyDefaultIgnored(spec, specs)

  const { name } = spec

  class Class extends Graph<I, O> {
    constructor(system: System, id: string, push?: boolean) {
      super(spec, branch, system, id, push)
    }
  }

  Object.defineProperty(Class, 'name', {
    value: name,
  })

  return Class
}

export function graphFromSpec<I, O>(
  system: System,
  spec: GraphSpec,
  specs: Specs,
  branch: { [path: string]: true },
  push: boolean
): Graph<I, O> {
  applyDefaultIgnored(spec, specs)

  return new Graph(spec, branch, system, spec.id, push)
}
