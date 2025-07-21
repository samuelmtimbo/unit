import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { bundleSpec } from '../../../../../bundle'
import { fromBundle } from '../../../../../spec/fromBundle'
import { exposePinSet } from '../../../../../spec/reducers/spec'
import { getSpec, newSpecId } from '../../../../../spec/util'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphPinSpec } from '../../../../../types/GraphPinSpec'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { IO } from '../../../../../types/IO'
import { clone } from '../../../../../util/clone'
import { weakMerge } from '../../../../../weakMerge'
import { ID_ADD_PIN } from '../../../../_ids'

export interface I<T> {
  id: string
  type: IO
  graph: GraphBundle
  pin: GraphPinSpec
}

export interface O<T> {
  graph: GraphBundle
}

export default class AddPin<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'type', 'pin', 'graph'],
        o: ['graph'],
      },
      {},
      system,
      ID_ADD_PIN
    )
  }

  f({ id, type, pin, graph }: I<T>, done: Done<O<T>>, fail: Fail): void {
    let new_graph: GraphBundle

    try {
      if (!id) {
        throw new Error('invalid pin id')
      }

      const specs = weakMerge(graph.__bundle.specs ?? {}, this.__system.specs)

      const new_spec_id = newSpecId(specs)
      const spec = getSpec(specs, graph.__bundle.unit.id) as GraphSpec

      const new_spec: GraphSpec = clone(spec)

      new_spec.id = new_spec_id

      delete new_spec.system

      exposePinSet({ pinId: id, type, pinSpec: pin }, new_spec)

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
