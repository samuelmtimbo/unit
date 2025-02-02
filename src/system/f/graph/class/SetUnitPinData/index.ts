import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { bundleSpec } from '../../../../../bundle'
import { getSpec, newSpecId } from '../../../../../spec/util'
import { evaluateData } from '../../../../../spec/evaluateDataValue'
import { fromBundle } from '../../../../../spec/fromBundle'
import { setUnitPinData } from '../../../../../spec/reducers/spec'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { IO } from '../../../../../types/IO'
import { clone } from '../../../../../util/clone'
import { weakMerge } from '../../../../../weakMerge'
import { ID_SET_UNIT_PIN_DATA } from '../../../../_ids'

export interface I<T> {
  id: string
  type: IO
  pinId: string
  data: any
  graph: GraphBundle
}

export interface O<T> {
  graph: GraphBundle
}

export default class SetUnitPinData<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'type', 'pinId', 'data', 'graph'],
        o: ['graph'],
      },
      {},
      system,
      ID_SET_UNIT_PIN_DATA
    )
  }

  f({ id, type, pinId, data, graph }: I<T>, done: Done<O<T>>): void {
    let new_graph: GraphBundle

    try {
      const specs = weakMerge(graph.__bundle.specs ?? {}, this.__system.specs)

      const new_spec_id = newSpecId(specs)
      const spec = getSpec(specs, graph.__bundle.unit.id) as GraphSpec

      const new_spec: GraphSpec = clone(spec)

      new_spec.id = new_spec_id

      delete new_spec.system

      data = evaluateData(data, specs, this.__system.classes)

      setUnitPinData(
        { unitId: id, type, pinId, data },
        new_spec,
        specs,
        this.__system.classes
      )

      const specs_ = weakMerge(specs, { [new_spec.id]: new_spec })

      const new_bundle = bundleSpec(new_spec, specs_)

      new_graph = fromBundle(new_bundle, specs_, this.__system.classes)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ graph: new_graph })
  }
}
