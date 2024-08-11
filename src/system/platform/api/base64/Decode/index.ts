import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_DECODE } from '../../../../_ids'

export type I = {
  b: string
}

export type O = {
  a: string
}

export default class Decode extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['b'],
        o: ['a'],
      },
      {},
      system,
      ID_DECODE
    )
  }

  f({ b }: I, done: Done<O>): void {
    let a

    try {
      a = atob(b)
    } catch {
      done(undefined, 'string not correctly encoded')

      return
    }

    done({ a })
  }
}
