import { Functional } from './Class/Functional'
import { Done } from './Class/Functional/Done'

export class MIMO<I, O> extends Functional<I, O> {
  f(i: I, done: Done<O>) {
    let m: any

    try {
      m = this.m(i)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done(m)
  }

  m(i: I): Partial<O> | undefined {
    return undefined
  }
}
