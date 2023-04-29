import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_SUBSTRING } from '../../../_ids'

export interface I {
  a: string
  from: number
  length: number
}

export interface O {
  a: string
}

export default class Substring extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'from', 'length'],
        o: ['a'],
      },
      {},
      system,
      ID_SUBSTRING
    )
  }

  f({ a, from, length }: I, done): void {
    done({ a: a.substring(from, from + length) })
  }
}
