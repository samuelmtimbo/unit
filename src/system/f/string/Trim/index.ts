import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_TRIM } from '../../../_ids'

export interface I {
  a: string
}

export interface O {
  a: string
}

export default class Trim extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {},
      system,
      ID_TRIM
    )
  }

  f({ a }: I, done: Done<O>): void {
    done({
      a: a.trim(),
    })
  }
}
