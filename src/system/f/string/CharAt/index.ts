import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_CHAR_AT } from '../../../_ids'

export interface I {
  a: string
  i: number
}

export interface O {
  'a[i]': string
}

export default class CharAt extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'i'],
        o: ['a[i]'],
      },
      {},
      system,
      ID_CHAR_AT
    )
  }

  f({ a, i }: I, done: Done<O>): void {
    done({ 'a[i]': a.charAt(i) })
  }
}
