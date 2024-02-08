import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_EQUALS } from '../../../_ids'
import isEqual from './f'

export interface I {
  a: any
  b: any
}

export interface O {
  'a = b': boolean
}

export default class Equals extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a = b'],
      },
      {},
      system,
      ID_EQUALS
    )
  }

  f({ a, b }: I, done: Done<O>): void {
    done({
      'a = b': isEqual(a, b),
    })
  }
}
