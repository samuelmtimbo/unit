import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { Config } from '../../../../Class/Unit/Config'
import { getSpec } from '../../../../client/spec'
import { GraphUnitSpec } from '../../../../types'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  class: UnitClass<any>
  graph: Graph
  id: string
}

export interface O<T> {}

export default class AddUnit<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['id', 'Class', 'graph'],
        o: [],
      },
      config,
      {
        input: {
          graph: {
            ref: true,
          },
        },
      }
    )
  }

  f(
    {
      id,
      Class,
      graph,
    }: {
      id: string
      Class: UnitClass<any>
      graph: Graph
    },
    done: Done<O<T>>
  ): void {
    try {
      const path = Class.id
      const spec = getSpec(path)
      const unit_spec: GraphUnitSpec = { path, input: {}, output: {} }
      const { inputs = {}, outputs = {} } = spec
      for (const inputId in inputs) {
        const input = inputs[inputId]
        const { defaultIgnored } = input
        if (defaultIgnored) {
          unit_spec.input[inputId] = unit_spec.input[inputId] || {}
          unit_spec.input[inputId].ignored = defaultIgnored
        }
      }
      for (const outputId in outputs) {
        const output = outputs[outputId]
        const { defaultIgnored } = output
        if (defaultIgnored) {
          unit_spec.output[outputId] = unit_spec.output[outputId] || {}
          unit_spec.output[outputId].ignored = defaultIgnored
        }
      }
      graph.addUnit(unit_spec, id)
      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
