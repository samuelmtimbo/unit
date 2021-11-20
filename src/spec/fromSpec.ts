import { Graph } from '../Class/Graph'
import { Config } from '../Class/Unit/Config'
import {
  GraphClass,
  GraphSpec,
  GraphUnitPinSpec,
  GraphUnitSpec,
  PinSpec,
  Specs,
} from '../types'
import { clone, mapObjVK } from '../util/object'

export function fromSpec<I = any, O = any>(
  spec: GraphSpec,
  specs: Specs,
  branch: { [path: string]: true } = {}
): GraphClass {
  spec = clone(spec)

  const { id, name, units } = spec

  for (const id in units) {
    const unitSpec: GraphUnitSpec = units[id]
    let { path, input = {}, output = {} } = unitSpec

    const spec = specs[path]

    const { inputs, outputs } = spec

    function setIgnored(
      unitPinSpec: GraphUnitPinSpec,
      pinSpec: PinSpec
    ): GraphUnitPinSpec {
      const { ignored } = unitPinSpec
      if (ignored === undefined) {
        const { defaultIgnored } = pinSpec
        if (defaultIgnored === true) {
          return { ...unitPinSpec, ignored: true }
        }
      }
      return unitPinSpec
    }

    unitSpec.input = mapObjVK(
      inputs,
      (inputPinSpec: PinSpec, inputId: string) => {
        const unitPinSpec = input[inputId] || {}
        return setIgnored(unitPinSpec, inputPinSpec)
      }
    )

    unitSpec.output = mapObjVK(
      outputs,
      (outputPinSpec: PinSpec, outputId: string) => {
        const unitPinSpec = output[outputId] || {}
        return setIgnored(unitPinSpec, outputPinSpec)
      }
    )
  }

  class Class<I, O> extends Graph<I, O> {
    static id: string = id

    constructor(config?: Config) {
      super(spec, config, branch)
    }
  }

  Object.defineProperty(Class, 'name', {
    value: name,
  })

  return Class
}
