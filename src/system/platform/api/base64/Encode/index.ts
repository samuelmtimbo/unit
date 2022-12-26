import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_ENCODE } from '../../../../_ids'

export type I = {
  a: string
}

export type O = {
  b: string
}

export default class Encode extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['b'],
      },
      {},
      system,
      ID_ENCODE
    )
  }

  f({ a }: I, done: Done<O>): void {
    let b

    try {
      b = btoa(a)
    } catch (err) {
      done(undefined, 'invalid string')
      return
    }

    done({
      b,
    })
  }
}
