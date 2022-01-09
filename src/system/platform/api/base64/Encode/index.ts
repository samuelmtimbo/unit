import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  a: string
}

export type O = {
  b: string
}

export default class Encode extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['b'],
      },
      {},
      system,
      pod
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
