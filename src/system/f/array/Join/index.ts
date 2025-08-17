import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_JOIN } from '../../../_ids'

export interface I {
  a: string[]
  sep: string
}

export interface O {
  str: string
}

export default class Join extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'sep'],
        o: ['str'],
      },
      {},
      system,
      ID_JOIN
    )
  }

  f({ a, sep }: I, done: Done<O>): void {
    const str = a.join(sep)
    done({ str })
  }
}
