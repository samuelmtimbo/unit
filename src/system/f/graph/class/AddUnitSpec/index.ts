import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { UnitBundleSpec } from '../../../../../types/UnitBundleSpec'
import { $G } from '../../../../../types/interface/async/$G'
import { Async } from '../../../../../types/interface/async/Async'
import { ID_ADD_UNIT_SPEC } from '../../../../_ids'

export interface I<T> {
  id: string
  unit: UnitBundleSpec
  graph: $G
}

export interface O<T> {
  graph: GraphBundle
}

export default class AddUnit0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'unit', 'graph'],
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
      ID_ADD_UNIT_SPEC
    )
  }

  f({ id, unit, graph }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$addUnit({ unitId: id, bundle: unit })
    } catch (err) {
      fail(err.message)

      return
    }

    done({})
  }
}
