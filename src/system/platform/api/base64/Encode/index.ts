import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export type I = {
  a: string
}

export type O = {
  b: string
}

export default class Encode extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['b'],
      },
      config
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
