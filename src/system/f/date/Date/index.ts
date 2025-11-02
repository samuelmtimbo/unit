import { Done } from '../../../../Class/Functional/Done'
import { Holder } from '../../../../Class/Holder'
import { System } from '../../../../system'
import { Async } from '../../../../types/interface/async/Async'
import { D } from '../../../../types/interface/D'
import { wrapDate } from '../../../../wrap/Date'
import { ID_DATE } from '../../../_ids'

export interface I<T> {
  init: string | number
}

export interface O<T> {
  date: D
}

export default class Date_<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['date'],
      },
      {
        output: {
          date: {
            ref: true,
          },
        },
      },
      system,
      ID_DATE
    )
  }

  f({ init }: Partial<I<T>>, done: Done<O<T>>): void {
    const date__ = new Date(init)

    const date_ = wrapDate(date__, this.__system)

    const date = Async(date_, ['D'], this.__system.async)

    done({ date })
  }
}
