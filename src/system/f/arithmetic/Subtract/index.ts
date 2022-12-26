import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_SUBTRACT } from '../../../_ids'
import subtract from './f'

export interface I {
  a: number
  b: number
}

export interface O {
  'a - b': number
}

export default class Subtract extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a - b'],
      },
      {},
      system,
      ID_SUBTRACT
    )
  }

  f(i: I, done: Done<O>): void {
    done(subtract(i))
  }
}
