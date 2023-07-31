import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { bundleSpec } from '../../../../bundle'
import { getSpec, newSpecId } from '../../../../client/spec'
import { fromBundle } from '../../../../spec/fromBundle'
import { addUnit } from '../../../../spec/reducers/spec_'
import { System } from '../../../../system'
import { GraphUnitSpec } from '../../../../types'
import { GraphBundle } from '../../../../types/GraphClass'
import { GraphSpec } from '../../../../types/GraphSpec'
import { UnitBundle } from '../../../../types/UnitBundle'
import { weakMerge } from '../../../../types/weakMerge'
import { ID_ADD_UNIT_0 } from '../../../_ids'

export interface I<T> {
  id: string
  class: UnitBundle<any>
  graph: GraphBundle
}

export interface O<T> {
  graph: GraphBundle
}

export default class AddUnit0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'class', 'graph'],
        o: ['graph'],
      },
      {},
      system,
      ID_ADD_UNIT_0
    )
  }

  f({ id, class: Class, graph }: I<T>, done: Done<O<T>>): void {
    let new_graph

    try {
      const { __bundle } = Class
      const { unit: __unit } = __bundle
      const { id: __id, input: __inputs = {} } = __unit

      const specs = weakMerge(__bundle.specs ?? {}, this.__system.specs)

      const unit_spec = getSpec(specs, __id)

      const unit_graph_spec: GraphUnitSpec = { id: __id, input: {}, output: {} }

      const { inputs = {}, outputs = {} } = unit_spec

      for (const inputId in inputs) {
        unit_graph_spec.input[inputId] = unit_graph_spec.input[inputId] || {}
        const __input = __inputs[inputId]
        if (__input) {
          const { data } = __input
          unit_graph_spec.input[inputId].data = data
        }
        const input = inputs[inputId]
        const { defaultIgnored } = input
        if (defaultIgnored) {
          unit_graph_spec.input[inputId].ignored = defaultIgnored
        }
      }

      for (const outputId in outputs) {
        const output = outputs[outputId]
        const { defaultIgnored } = output
        if (defaultIgnored) {
          unit_graph_spec.output[outputId] =
            unit_graph_spec.output[outputId] || {}
          unit_graph_spec.output[outputId].ignored = defaultIgnored
        }
      }

      const new_spec_id = newSpecId(specs)
      const spec = getSpec(specs, graph.__bundle.unit.id) as GraphSpec

      const new_spec: GraphSpec = { ...spec, id: new_spec_id }

      addUnit({ unitId: id, unit: unit_graph_spec }, new_spec)

      const new_bundle = bundleSpec(new_spec, specs)

      new_graph = fromBundle(new_bundle, specs)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ graph: new_graph })
  }
}
