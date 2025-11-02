import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { $D } from '../../../../../types/interface/async/$D'
import { ID_GET_DATE } from '../../../../_ids'

export interface I<T> {
  any: T
  date: $D
}

export interface O<T> {
  day: number
}

export default class GetDate<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any', 'date'],
        o: ['day'],
      },
      {
        input: {
          date: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_DATE
    )
  }

  f({ date }: Partial<I<T>>, done: Done<O<T>>): void {
    date.$getDate({}, (day) => {
      done({ day })
    })
  }
}
