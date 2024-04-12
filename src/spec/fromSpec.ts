import { Graph } from '../Class/Graph'
import deepGet from '../deepGet'
import { System } from '../system'
import { Classes, PinSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphBundle, GraphClass } from '../types/GraphClass'
import { GraphSpec } from '../types/GraphSpec'
import { GraphSpecs } from '../types/GraphSpecs'
import { GraphUnitPinSpec } from '../types/GraphUnitPinSpec'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { io } from '../types/IOOf'
import { weakMerge } from '../weakMerge'
import { bundleClass } from './bundleClass'
import { evaluateDataValue } from './evaluateDataValue'

export function extractGraphSpecs(
  spec: GraphSpec,
  specs: Specs,
  graphs: GraphSpecs = {},
  classes: Classes = {}
): GraphSpecs {
  graphs[spec.id] = spec

  const { units } = spec

  for (const unit_id in units) {
    const unit = units[unit_id]

    const { id, input } = unit

    for (const inputId in input) {
      const _input = input[inputId] ?? {}

      const { data } = _input

      if (data !== undefined) {
        const dataRef = evaluateDataValue(data, specs, classes)

        for (const path of dataRef.ref ?? []) {
          const bundle = deepGet(dataRef.data, path)

          for (const specId in bundle.specs) {
            const spec = bundle.specs[specId]

            graphs[specId] = spec
          }

          for (const specId in bundle.specs) {
            const spec = bundle.specs[specId]

            extractGraphSpecs(spec, weakMerge(specs, graphs), graphs)
          }
        }
      }
    }

    const unit_spec = specs[id]

    if (!unit_spec) {
      return
    }

    const { system } = unit_spec

    if (!system) {
      if (!graphs[id]) {
        graphs[id] = unit_spec as GraphSpec

        extractGraphSpecs(graphs[id], specs, graphs)
      }
    }
  }

  return graphs
}

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

  const specs = extractGraphSpecs(spec, specs_, {})

  const unit = { id }

  const Bundle = bundleClass(Class, { unit, specs })

  return Bundle
}

export function applyUnitDefaultIgnored(
  unitSpec: GraphUnitSpec,
  specs: Specs
): void {
  unitSpec.input = unitSpec.input || {}
  unitSpec.output = unitSpec.output || {}

  const { id } = unitSpec

  const spec = specs[id]

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

  const { id, name } = spec

  class Class extends Graph<I, O> {
    constructor(system: System) {
      const spec = system.getSpec(id) as GraphSpec

      super(spec, branch, system, id)
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
  branch: { [path: string]: true } = {}
): Graph<I, O> {
  applyDefaultIgnored(spec, specs)

  return new Graph(spec, branch, system, spec.id)
}
