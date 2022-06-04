import { Graph } from '../Class/Graph'
import { Pod } from '../pod'
import { System } from '../system'
import {
  GraphSpec,
  GraphSpecs,
  GraphUnitPinSpec,
  GraphUnitSpec,
  PinSpec,
  Specs,
} from '../types'
import { Dict } from '../types/Dict'
import { GraphBundle, GraphClass } from '../types/GraphClass'
import { clone } from '../util/object'
import { bundleClass } from './bundleClass'

export function extractGraphSpecs(spec: GraphSpec, specs: Specs): GraphSpecs {
  const graphs: GraphSpecs = {}

  const { units } = spec

  for (const unit_id in units) {
    const unit = units[unit_id]

    const { id } = unit

    const unit_spec = specs[id]

    const { system } = unit_spec

    if (!system) {
      graphs[id] = unit_spec as GraphSpec
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

  const specs = extractGraphSpecs(spec, _specs)

  const Bundle = bundleClass(Class, { unit: { id }, specs })

  return Bundle
}

export function _fromSpec<I, O>(
  spec: GraphSpec,
  specs: Specs,
  branch: { [path: string]: true } = {}
): GraphClass<I, O> {
  spec = clone(spec)

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

  class Class<I, O> extends Graph<I, O> {
    constructor(system: System, pod: Pod) {
      super(spec, branch, system, pod)
    }
  }

  Object.defineProperty(Class, 'name', {
    value: name,
  })

  return __fromSpec(spec, branch)
}

export function __fromSpec<I, O>(
  spec: GraphSpec,
  branch: { [path: string]: true } = {}
): GraphClass<I, O> {
  const { name } = spec

  class Class extends Graph<I, O> {
    constructor(system: System, pod: Pod) {
      super(spec, branch, system, pod)
    }
  }

  Object.defineProperty(Class, 'name', {
    value: name,
  })

  return Class
}
