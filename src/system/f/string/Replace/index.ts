import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: string
  regex: string
  replacement: string
}

export interface O {
  a: string
}

export default class Replace extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'regex', 'replacement'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, regex, replacement }: I, done): void {
    done({ a: a.replace(new RegExp(regex, 'g'), replacement) })
  }
}
