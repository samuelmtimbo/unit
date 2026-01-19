import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_INDEX_OF } from '../../../../_ids'

export interface I<T> {
  'a[]': A
  a: T
}

export interface O<T> {
  i: number
}

export default class IndexOf<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a[]', 'a'],
        o: ['i'],
        $i: 'a[]',
        $o: 'i',
        $m: 'indexOf',
        $_: ['A'],
      },
      {
        input: {
          'a[]': {
            ref: true,
          },
        },
      },
      system,
      ID_INDEX_OF
    )
  }

  opt({ a }) {
    return { a }
  }
}
