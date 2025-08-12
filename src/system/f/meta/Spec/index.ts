import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { Spec } from '../../../../types'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { ID_SPEC } from '../../../_ids'

export interface I<T> {
  unit: $U
}

export interface O<T> {
  spec: Spec
}

export default class _Spec<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'any'],
        o: ['spec'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_SPEC
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>, fail: Fail): void {
    unit = Async(unit, ['U'], this.__system.async)

    unit.$getSpec({}, (spec, err) => {
      if (err) {
        fail(err)

        return
      }

      done({ spec })
    })
  }
}
