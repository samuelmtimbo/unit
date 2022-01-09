import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import subtract from './f'

export interface I {
  a: number
  b: number
}

export interface O {
  'a - b': number
}

export default class Subtract extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a - b'],
      },
      {},
      system,
      pod
    )
  }

  f(i: I, done: Done<O>): void {
    done(subtract(i))
  }
}
