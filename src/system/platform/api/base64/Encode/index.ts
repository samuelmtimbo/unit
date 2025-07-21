import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { ID_ENCODE } from '../../../../_ids'

export type I = {
  a: string
}

export type O = {
  b: string
}

export default class EncodeBase64 extends Functional<I, O> {
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

  f({ a }: I, done: Done<O>, fail: Fail): void {
    let b: string

    try {
      b = btoa(a)
    } catch (err) {
      fail('invalid string')

      return
    }

    done({
      b,
    })
  }
}
