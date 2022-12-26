import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_NOT } from '../../../_ids'

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
      ID_NOT
    )
  }

  f({ a }: I, done): void {
    done({ '~a': ~a })
  }
}
