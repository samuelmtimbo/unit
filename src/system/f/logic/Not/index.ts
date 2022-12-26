import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_NOT_0 } from '../../../_ids'

export interface I {
  a: boolean
}

export interface O {
  '!a': boolean
}

export default class Not extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['!a'],
      },
      {},
      system,
      ID_NOT_0
    )
  }

  f({ a }: I, done): void {
    done({ '!a': !a })
  }
}
