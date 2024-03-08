import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { bundleSpec } from '../../../../bundle'
import { getSpec, newSpecId } from '../../../../client/spec'
import { fromBundle } from '../../../../spec/fromBundle'
import { applyUnitDefaultIgnored } from '../../../../spec/fromSpec'
import { addUnit } from '../../../../spec/reducers/spec_'
import { System } from '../../../../system'
import { GraphBundle } from '../../../../types/GraphClass'
import { GraphSpec } from '../../../../types/GraphSpec'
import { GraphUnitSpec } from '../../../../types/GraphUnitSpec'
import { UnitBundle } from '../../../../types/UnitBundle'
import { clone } from '../../../../util/object'
import { weakMerge } from '../../../../weakMerge'
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

      const unitSpec: GraphUnitSpec = { id: __id, input: {}, output: {} }

      applyUnitDefaultIgnored(unitSpec, specs)

      const new_spec_id = newSpecId(specs)
      const spec = getSpec(specs, graph.__bundle.unit.id) as GraphSpec

      const new_spec: GraphSpec = clone(spec)

      new_spec.id = new_spec_id

      addUnit({ unitId: id, unit: unitSpec }, new_spec)

      const new_bundle = bundleSpec(new_spec, specs)

      new_graph = fromBundle(new_bundle, specs, this.__system.classes)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ graph: new_graph })
  }
}
