import { Functional } from './Class/Functional'
import { Done } from './Class/Functional/Done'

export class MIMO<I, O> extends Functional<I, O> {
  f(i: I, done: Done<O>) {
    try {
      const m = this.m(i)
      done(m)
    } catch (err) {
      done(undefined, err)
    }
  }

  m(i: I): Partial<O> | undefined {
    return undefined
  }
}
