import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { Holder } from '../../../../Class/Holder'
import { Moment } from '../../../../debug/Moment'
import { System } from '../../../../system'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { ID_DEBUG } from '../../../_ids'

export interface I<T> {
  unit: $U
  opt: {
    events: string[]
  }
}

export interface O<T> {
  moment: Moment
}

export default class Debug<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'opt'],
        fo: [],
        i: [],
        o: ['moment'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_DEBUG
    )
  }

  f({ unit, opt }: I<T>, done: Done<O<T>>, fail: Fail): void {
    unit = Async(unit, ['U'], this.__system.async)

    try {
      unit.$watch(opt, (moment) => {
        this._output.moment.push(moment)
      })
    } catch (err) {
      fail(err.message)

      return
    }
  }
}
