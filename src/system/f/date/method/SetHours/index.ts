import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { $D } from '../../../../../types/interface/async/$D'
import { ID_SET_HOURS } from '../../../../_ids'

export interface I<T> {
  date: $D
  hours: number
  min: number
  sec: number
  ms: number
}

export interface O<T> {
  done: any
}

export default class SetHours<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['date', 'hours', 'min', 'sec', 'ms'],
        o: ['done'],
      },
      {
        input: {
          date: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_HOURS
    )
  }

  f({ date, hours, min, sec, ms }: Partial<I<T>>, done: Done<O<T>>): void {
    date.$setHours({ hours, min, sec, ms })

    done({ done: true })
  }
}
