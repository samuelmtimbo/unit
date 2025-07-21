import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { applyUnitDefaultIgnored } from '../../../../spec/fromSpec'
import { System } from '../../../../system'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { UnitBundle } from '../../../../types/UnitBundle'
import { clone } from '../../../../util/clone'
import { weakMerge } from '../../../../weakMerge'
import { ID_ADD_UNIT } from '../../../_ids'

export interface I<T> {
  id: string
  class: UnitBundle<any>
  graph: $G
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

  f({ id, class: Class, graph }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      if (!id) {
        throw new Error('invalid unit id')
      }

      const { __bundle } = Class
      const { id: __id, input: __inputs = {} } = __bundle.unit

      const specs = weakMerge(__bundle.specs, this.__system.specs)

      const bundle = clone(__bundle)

      applyUnitDefaultIgnored(bundle.unit, specs)

      graph.$addUnit({ unitId: id, bundle })
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
