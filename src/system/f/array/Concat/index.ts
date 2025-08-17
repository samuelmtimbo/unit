import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_CONCAT } from '../../../_ids'

export interface I<A, B> {
  a: A[]
  b: B[]
}

export interface O<A, B> {
  ab: (A | B)[]
}

export default class Concat<A, B> extends Functional<I<A, B>, O<A, B>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      {},
      system,
      ID_CONCAT
    )
  }

  f({ a, b }: I<A, B>, done: Done<O<A, B>>): void {
    done({ ab: a.concat(b as any) })
  }
}
