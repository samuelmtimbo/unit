import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_HAS_KEY_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  key: string
}

export interface O<T> {
  has: boolean
}

export default class HasKey<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key'],
        o: ['has'],
        $i: 'obj',
        $o: 'has',
        $m: 'hasKey',
        $_: ['J'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_HAS_KEY_0
    )
  }

  opt({ key }) {
    return { key }
  }
}
