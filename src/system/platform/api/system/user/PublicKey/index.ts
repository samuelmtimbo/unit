import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { ID_PUBLIC_KEY } from '../../../../../_ids'

export type I = {
  any: any
}

export type O = {
  key: string
}

export default class PublicKey extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['key'],
      },
      {},
      system,
      ID_PUBLIC_KEY
    )
  }

  f({ any }, done: Done<O>): void {
    done()
  }
}
