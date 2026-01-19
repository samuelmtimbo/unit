import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { $A } from '../../../../../types/interface/async/$A'
import { ID_AT_0 } from '../../../../_ids'

export interface I<T> {
  a: $A
  i: number
}

export interface O<T> {
  'a[i]': T
}

export default class At0<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'i'],
        o: ['a[i]'],
        $i: 'a',
        $o: 'a[i]',
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
      ID_AT_0
    )
  }

  opt({ i }) {
    return { i }
  }
}
