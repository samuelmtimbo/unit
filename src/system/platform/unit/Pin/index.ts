import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { Holder } from '../../../../Class/Holder'
import { System } from '../../../../system'
import { $U } from '../../../../types/interface/async/$U'
import { $V } from '../../../../types/interface/async/$V'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'

import { ID_PIN } from '../../../_ids'

export interface I<T> {
  unit: $U
  name: string
  type: IO
  done: T
}

export interface O<T> {
  pin: $V & $
  done: any
}

export default class Pin_<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'name', 'type'],
        fo: ['pin'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
        output: {
          pin: {
            ref: true,
          },
        },
      },
      system,
      ID_PIN
    )
  }

  async f({ unit, name, type }: I<T>, done: Done<O<T>>, fail: Fail) {
    unit = Async(unit, ['U'], this.__system.async)

    try {
      const pin = unit.$refPin({ type, pinId: name })

      done({ pin })
    } catch (err) {
      fail(err.message)
    }
  }

  b() {
    this._output.done.push(true)
  }
}
