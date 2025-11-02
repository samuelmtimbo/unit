import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { $D } from '../../../../../types/interface/async/$D'
import { ID_GET_TIME } from '../../../../_ids'

export interface I<T> {
  any: T
  date: $D
}

export interface O<T> {
  time: number
}

export default class GetTime<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any', 'date'],
        o: ['time'],
      },
      {
        input: {
          date: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_TIME
    )
  }

  f({ date }: Partial<I<T>>, done: Done<O<T>>): void {
    date.$getTime({}, (time) => {
      done({ time })
    })
  }
}
