import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: string[]
  sep: string
}

export interface O {
  str: string
}

export default class Join extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'sep'],
        o: ['str'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, sep }: I, done): void {
    const str = a.join(sep)
    done({ str })
  }
}
