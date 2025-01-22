import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { bundleSpec } from '../../../../../bundle'
import { getSpec, newSpecId } from '../../../../../client/spec'
import { fromBundle } from '../../../../../spec/fromBundle'
import { setMetadata } from '../../../../../spec/reducers/spec'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { clone } from '../../../../../util/clone'
import { weakMerge } from '../../../../../weakMerge'
import { ID_SET_METADATA } from '../../../../_ids'

export interface I<T> {
  graph: GraphBundle
  value: any
  path: string[]
}

export interface O<T> {
  graph: GraphBundle
}

export default class SetMetadata<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['path', 'value', 'graph'],
        o: ['graph'],
      },
      {},
      system,
      ID_SET_METADATA
    )
  }

  f({ path, value, graph }: I<T>, done: Done<O<T>>): void {
    let new_graph: GraphBundle

    try {
      const specs = weakMerge(graph.__bundle.specs ?? {}, this.__system.specs)

      const new_spec_id = newSpecId(specs)
      const spec = getSpec(specs, graph.__bundle.unit.id) as GraphSpec

      const new_spec: GraphSpec = clone(spec)

      new_spec.id = new_spec_id

      delete new_spec.system

      setMetadata({ path: ['metadata', ...path], value }, new_spec)

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
