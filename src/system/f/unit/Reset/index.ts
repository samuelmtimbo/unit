import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { ID_RESET } from '../../../_ids'

export interface I<T> {
  unit: $U
  any: any
}

export interface O<T> {}

export default class Reset<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'any'],
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
      ID_RESET
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>): void {
    unit = Async(unit, ['U'], this.__system.async)

    unit.$reset({})

    done(undefined)
  }
}
