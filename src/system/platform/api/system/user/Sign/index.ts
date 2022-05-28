import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'

export type I = {
  value: string
}

export type O = {
  hash: string
}

export default class Sign extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['value'],
        o: ['hash'],
      },
      {},
      system,
      pod
    )
  }

  f({ value }, done: Done<O>): void {
    done()
  }
}
