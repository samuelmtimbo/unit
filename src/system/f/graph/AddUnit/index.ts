import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { System } from '../../../../system'
import { GraphUnitSpec } from '../../../../types'
import { G } from '../../../../types/interface/G'
import { UnitBundle } from '../../../../types/UnitBundle'
import { weakMerge } from '../../../../types/weakMerge'
import { ID_ADD_UNIT } from '../../../_ids'

export interface I<T> {
  id: string
  class: UnitBundle<any>
  graph: G
}

export interface O<T> {}

export default class AddUnit<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'class', 'graph'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_ADD_UNIT
    )
  }

  f(
    {
      id,
      Class,
      graph,
    }: {
      id: string
      Class: UnitBundle<any>
      graph: G
    },
    done: Done<O<T>>
  ): void {
    try {
      const { __bundle } = Class
      const { unit: __unit } = __bundle
      const { id: __id, input: __inputs = {} } = __unit

      const specs = weakMerge(__bundle.specs, this.__system.specs)

      const spec = getSpec(specs, __id)

      const unit_spec: GraphUnitSpec = { id: __id, input: {}, output: {} }

      const { inputs = {}, outputs = {} } = spec

      for (const inputId in inputs) {
        unit_spec.input[inputId] = unit_spec.input[inputId] || {}
        const __input = __inputs[inputId]
        if (__input) {
          const { data } = __input
          unit_spec.input[inputId].data = data
        }
        const input = inputs[inputId]
        const { defaultIgnored } = input
        if (defaultIgnored) {
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

      graph.addUnitSpec(id, { unit: unit_spec })

      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
