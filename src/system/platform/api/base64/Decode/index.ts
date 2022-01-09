import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  b: string
}

export type O = {
  a: string
}

export default class Decode extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['b'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ b }: I, done: Done<O>): void {
    let a

    try {
      a = atob(b)
    } catch {
      done(undefined, 'string not correctly enconded')
      return
    }

    done({ a })
  }
}
