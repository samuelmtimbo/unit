import { Functional } from '../../../../Class/Functional'
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

  f({ a, sep }: I, done): void {
    const str = a.join(sep)
    done({ str })
  }
}
