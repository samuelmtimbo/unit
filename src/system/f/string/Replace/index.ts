import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_REPLACE } from '../../../_ids'

export interface I {
  a: string
  regex: string
  replacement: string
}

export interface O {
  a: string
}

export default class Replace extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'regex', 'replacement'],
        o: ['a'],
      },
      {},
      system,
      ID_REPLACE
    )
  }

  f({ a, regex, replacement }: I, done): void {
    done({ a: a.replace(new RegExp(regex, 'g'), replacement) })
  }
}
