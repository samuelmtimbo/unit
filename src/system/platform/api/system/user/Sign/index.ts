import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { ID_SIGN_0 } from '../../../../../_ids'

export type I = {
  value: string
}

export type O = {
  hash: string
}

export default class Sign extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value'],
        o: ['hash'],
      },
      {},
      system,
      ID_SIGN_0
    )
  }

  f({ value }, done: Done<O>): void {
    done()
  }
}
