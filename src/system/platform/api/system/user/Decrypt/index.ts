import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'

export type I = {
  hash: string
}

export type O = {
  value: string
}

export default class Decrypt extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['hash'],
        o: ['value'],
      },
      {},
      system,
      pod
    )
  }

  f({ hash }, done: Done<O>): void {
    done()
  }
}
