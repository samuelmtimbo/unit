import { Graph } from '../Class/Graph'
import { System } from '../system'
import { Classes, PinSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphBundle, GraphClass } from '../types/GraphClass'
import { GraphSpec } from '../types/GraphSpec'
import { GraphSpecs } from '../types/GraphSpecs'
import { GraphUnitPinSpec } from '../types/GraphUnitPinSpec'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { weakMerge } from '../types/weakMerge'
import { clone } from '../util/object'
import { bundleClass } from './bundleClass'
import { evaluate } from './evaluate'
import { TreeNodeType, getTree } from './parser'

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

      if (data) {
        const tree = getTree(data)

        if (tree.type === TreeNodeType.Unit) {
          const str = tree.value.substring(1)

          const bundle = evaluate(str, specs, classes)

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
  _specs: Specs,
  branch: { [path: string]: true } = {}
): GraphBundle<I, O> {
  const Class = _fromSpec<I, O>(spec, _specs, branch)

  const { id } = spec

  if (!id) {
    throw new Error('spec id is required')
  }

  const specs = extractGraphSpecs(spec, _specs, clone(spec.specs ?? {}))

  const Bundle = bundleClass(Class, { unit: { id }, specs })

  return Bundle
}

export function _fromSpec<I, O>(
  spec: GraphSpec,
  specs: Specs,
  branch: { [path: string]: true } = {}
): GraphClass<I, O> {
  const { name, units } = spec

  for (const unitId in units) {
    const unitSpec: GraphUnitSpec = units[unitId]

    unitSpec.input = unitSpec.input || {}
    unitSpec.output = unitSpec.output || {}

    const { id, input, output } = unitSpec

    const spec = specs[id]

    const { inputs, outputs } = spec

    function setIgnored(unitPinSpec: GraphUnitPinSpec, pinSpec: PinSpec): void {
      const { ignored } = unitPinSpec
      if (ignored === undefined) {
        const { defaultIgnored } = pinSpec
        if (defaultIgnored === true) {
          unitPinSpec.ignored = true
        }
      }
    }

    for (const inputId in inputs) {
      const inputPinSpec = inputs[inputId]
      input[inputId] = input[inputId] || {}
      const unitInputPinSpec = input[inputId]
      setIgnored(unitInputPinSpec, inputPinSpec)
    }

    for (const outputId in outputs) {
      const outputPinSpec = outputs[outputId]
      output[outputId] = output[outputId] || {}
      const unitOutputPinSpec = output[outputId]
      setIgnored(unitOutputPinSpec, outputPinSpec)
    }
  }

  return __fromSpec(spec, branch)
}

export function __fromSpec<I, O>(
  spec: GraphSpec,
  branch: { [path: string]: true } = {}
): GraphClass<I, O> {
  const { id, name } = spec

  if (!id) {
    throw new Error('')
  }

  class Class extends Graph<I, O> {
    constructor(system: System) {
      super(spec, branch, system, id)
    }
  }

  Object.defineProperty(Class, 'name', {
    value: name,
  })

  return Class
}
