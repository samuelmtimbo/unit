import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export type I = {
  a: string
}

export type O = {
  b: string
}

export default class Encode extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['b'],
    })
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
