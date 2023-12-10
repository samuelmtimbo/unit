import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'
import { ID_STRINGIFY } from '../../../_ids'

export type I = {
  a: any
}

export type O = {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['str'],
      },
      {},
      system,
      ID_STRINGIFY
    )
  }

  f({ a }: I, done: Done<O>): void {
    let str: string

    try {
      str = stringify(a)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({
      str,
    })
  }
}
