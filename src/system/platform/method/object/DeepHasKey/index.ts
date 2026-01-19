import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_DEEP_GET_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  path: string[]
}

export interface O<T> {
  has: boolean
}

export default class DeepHasKey<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path', 'key'],
        o: ['has'],
        $i: 'obj',
        $o: 'has',
        $m: 'deepHas',
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
      ID_DEEP_GET_0
    )
  }

  opt({ path }) {
    return { path }
  }
}
