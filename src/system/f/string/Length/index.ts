import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_LENGTH_0 } from '../../../_ids'

export interface I {
  a: string
}

export interface O {
  length: number
}

export default class Length extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['length'],
      },
      {},
      system,
      ID_LENGTH_0
    )
  }

  f({ a }: I, done: Done<O>): void {
    done({ length: a.length })
  }
}
