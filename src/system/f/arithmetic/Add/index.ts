import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { ID_ADD } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a + b': number
}

export default class Add extends Functional<I, O> {
  _ = ID_ADD

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a + b'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I, done: Done<O>): void {
    done({ 'a + b': a + b })
  }
}
