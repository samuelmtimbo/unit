import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_KEYS_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  any: any
}

export interface O<T> {
  keys: string[]
}

export default class Keys<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'any'],
        o: ['keys'],
        $i: 'obj',
        $o: 'keys',
        $m: 'keys',
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
      ID_KEYS_0
    )
  }
}
