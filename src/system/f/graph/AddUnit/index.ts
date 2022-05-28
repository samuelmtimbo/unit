import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { GraphUnitSpec } from '../../../../types'
import { G } from '../../../../types/interface/G'
import { UnitBundle } from '../../../../types/UnitBundle'

export interface I<T> {
  id: string
  Class: UnitBundle<any>
  graph: G
}

export interface O<T> {}

export default class AddUnit<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      },
      system,
      pod
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

      const spec = getSpec(
        { ...__bundle.specs, ...this.__pod.specs, ...this.__system.specs },
        __id
      )

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

      graph.addUnit({ unit: unit_spec }, id)

      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
