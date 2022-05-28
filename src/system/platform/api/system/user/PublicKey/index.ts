import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'

export type I = {
  any: any
}

export type O = {
  key: string
}

export default class PublicKey extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['key'],
      },
      {},
      system,
      pod
    )
  }

  f({ any }, done: Done<O>): void {
    done()
  }
}
