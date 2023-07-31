import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { ID_PAUSE } from '../../../_ids'

export interface I<T> {
  unit: Unit
  opt: {}
}

export interface O<T> {}

export default class Pause<T> extends Functional<I<T>, O<T>> {
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
      ID_PAUSE
    )
  }

  f({ unit, opt }: I<T>, done: Done<O<T>>): void {
    unit.pause()

    done({})
  }
}
