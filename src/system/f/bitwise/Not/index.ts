import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_NOT_0 } from '../../../_ids'

export interface I {
  a: number
}

export interface O {
  '~a': number
}

export default class Not extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['~a'],
      },
      {},
      system,
      ID_NOT_0
    )
  }

  f({ a }: I, done: Done<O>): void {
    done({ '~a': ~a })
  }
}
