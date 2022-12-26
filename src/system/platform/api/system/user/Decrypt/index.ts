import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { ID_DECRYPT } from '../../../../../_ids'

export type I = {
  hash: string
}

export type O = {
  value: string
}

export default class Decrypt extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['hash'],
        o: ['value'],
      },
      {},
      system,
      ID_DECRYPT
    )
  }

  f({ hash }, done: Done<O>): void {
    done()
  }
}
