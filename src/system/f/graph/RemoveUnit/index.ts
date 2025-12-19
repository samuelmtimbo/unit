import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { fromBundle } from '../../../../spec/fromBundle'
import { System } from '../../../../system'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_REMOVE_UNIT } from '../../../_ids'

export interface I<T> {
  graph: $G
  id: string
}

export interface O<T> {
  class: UnitBundle
}

export default class RemoveUnit<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'graph'],
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
      ID_REMOVE_UNIT
    )
  }

  f({ id, graph }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    let Class: UnitBundle

    try {
      const unit = graph.$refUnit({ unitId: id, __: ['U'] })

      unit.$getUnitBundleSpec({}, (bundle) => {
        graph.$removeUnit({ unitId: id })

        Class = fromBundle(bundle, this.__system.specs, this.__system.classes)
      })
    } catch (err) {
      fail(err.message)

      return
    }

    done({
      class: Class,
    })
  }
}
