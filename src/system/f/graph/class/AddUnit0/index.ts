import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { bundleSpec } from '../../../../../bundle'
import { fromBundle } from '../../../../../spec/fromBundle'
import { applyUnitDefaultIgnored } from '../../../../../spec/fromSpec'
import { addUnit } from '../../../../../spec/reducers/spec'
import { getSpec, newSpecId } from '../../../../../spec/util'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { GraphUnitSpec } from '../../../../../types/GraphUnitSpec'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { clone } from '../../../../../util/clone'
import { weakMerge } from '../../../../../weakMerge'
import { ID_ADD_UNIT_0 } from '../../../../_ids'

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

  f({ id, class: Class, graph }: I<T>, done: Done<O<T>>, fail: Fail): void {
    let new_graph: GraphBundle

    try {
      const { __bundle } = Class
      const { unit: __unit } = __bundle
      const { id: __id } = __unit

      if (!id) {
        throw new Error('invalid unit id')
      }

      const specs = weakMerge(
        graph.__bundle.specs ?? {},
        weakMerge(__bundle.specs ?? {}, this.__system.specs)
      )

      const unit: GraphUnitSpec = clone(__unit)

      applyUnitDefaultIgnored(unit, specs)

      const new_spec_id = newSpecId(specs)
      const spec = getSpec(specs, graph.__bundle.unit.id) as GraphSpec

      const new_spec: GraphSpec = clone(spec)

      new_spec.id = new_spec_id

      delete new_spec.system

      addUnit({ unitId: id, unit }, new_spec)

      const specs_ = weakMerge(specs, { [new_spec.id]: new_spec })

      const new_bundle = bundleSpec(new_spec, specs_)

      new_graph = fromBundle(new_bundle, specs_, this.__system.classes)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ graph: new_graph })
  }
}
