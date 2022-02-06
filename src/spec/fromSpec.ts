import { Graph } from '../Class/Graph'
import { Pod } from '../pod'
import { System } from '../system'
import {
  GraphSpec,
  GraphUnitPinSpec,
  GraphUnitSpec,
  PinSpec,
  Specs,
} from '../types'
import { GraphClass } from '../types/GraphClass'
import { clone } from '../util/object'
import { bundleClass } from './bundleClass'

export function fromSpec<I = any, O = any>(
  spec: GraphSpec,
  specs: Specs,
  branch: { [path: string]: true } = {}
): GraphClass {
  const Class = _fromSpec(spec, specs, branch)

  const { id } = spec

  bundleClass(Class, { unit: { id } })

  return Class
}

export function _fromSpec<I = any, O = any>(
  spec: GraphSpec,
  specs: Specs,
  branch: { [path: string]: true } = {}
): GraphClass {
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

  return Class
}
