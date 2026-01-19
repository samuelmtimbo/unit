import { Getter } from '../../../../../Class/Getter'
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

export default class GetTime<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['date', 'any'],
        o: ['time'],
        $i: 'date',
        $o: 'time',
        $m: 'getTime',
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
      ID_GET_TIME
    )
  }
}
