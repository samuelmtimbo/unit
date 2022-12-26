import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_SUBSTR } from '../../../_ids'

export interface I {
  a: string
  from: number
  length: number
}

export interface O {
  a: string
}

export default class Substr extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'from', 'length'],
        o: ['a'],
      },
      {},
      system,
      ID_SUBSTR
    )
  }

  f({ a, from, length }: I, done): void {
    done({ a: a.substr(from, length) })
  }
}
