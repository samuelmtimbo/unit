import { Getter } from '../../../../../Class/Getter'
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

export default class GetDate<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['date', 'any'],
        o: ['day'],
        $i: 'date',
        $o: 'day',
        $m: 'getDate',
        $_: ['D'],
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
}
