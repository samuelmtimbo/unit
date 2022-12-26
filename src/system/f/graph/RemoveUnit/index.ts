import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { cloneBundle } from '../../../../spec/cloneBundle'
import { System } from '../../../../system'
import { G } from '../../../../types/interface/G'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_REMOVE_UNIT } from '../../../_ids'

export interface I<T> {
  graph: G
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

  f({ id, graph }: I<T>, done: Done<O<T>>): void {
    try {
      const unit = graph.removeUnit(id)

      const Bundle = cloneBundle(unit)

      done({
        class: Bundle,
      })
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
