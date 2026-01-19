import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_LENGTH_1 } from '../../../../_ids'

export interface I<T> {
  a: A
  any: any
}

export interface O<T> {
  length: number
}

export default class Length1<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'any'],
        o: ['length'],
        $i: 'a',
        $o: 'length',
        $m: 'length',
        $_: ['A'],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
      },
      system,
      ID_LENGTH_1
    )
  }
}
