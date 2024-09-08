import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { ID_PLAY } from '../../../_ids'

export interface I<T> {
  unit: $U
  opt: {}
}

export interface O<T> {}

export default class Play<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'opt'],
        o: [],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_PLAY
    )
  }

  f({ unit, opt }: I<T>, done: Done<O<T>>): void {
    unit = Async(unit, ['U'], this.__system.async)

    unit.$play({})

    done()
  }
}
