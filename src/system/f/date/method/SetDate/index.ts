import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { $D } from '../../../../../types/interface/async/$D'
import { ID_SET_DATE } from '../../../../_ids'

export interface I<T> {
  date: $D
  day: number
}

export interface O<T> {
  done: any
}

export default class SetHours<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['date', 'day'],
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
      ID_SET_DATE
    )
  }

  f({ date, day }: Partial<I<T>>, done: Done<O<T>>): void {
    date.$setDate({ day })

    done({ done: true })
  }
}
