import { Getter } from '../../../../../Class/Getter'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_GET_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
}

export interface O<T> {
  value: T
}

export default class Get0<T> extends Getter<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'name'],
        o: ['value'],
        $i: 'obj',
        $o: 'value',
        $m: 'get',
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
      ID_GET_0
    )
  }

  opt({ name }) {
    return { name }
  }
}
