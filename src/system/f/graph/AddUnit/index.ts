import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { getSpec } from '../../../../client/spec'
import { GraphUnitSpec } from '../../../../types'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  id: string
  Class: UnitClass<any>
  graph: Graph
}

export interface O<T> {}

export default class AddUnit<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super(
      {
        i: ['id', 'Class', 'graph'],
        o: [],
      },
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
    if (this.__system) {
      done(undefined, 'unplugged')
      return
    }

    const { specs } = this.__system

    try {
      const id = Class.__id
      const spec = getSpec(specs, id)
      const unit_spec: GraphUnitSpec = { id, input: {}, output: {} }
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
