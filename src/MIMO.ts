import { Functional } from './Class/Functional'
import { Done } from './Class/Functional/Done'
import { Fail } from './Class/Functional/Fail'

export class MIMO<I, O> extends Functional<I, O> {
  f(i: I, done: Done<O>, fail: Fail) {
    let m: any

    try {
      m = this.m(i)
    } catch (err) {
      fail(err.message)

      return
    }

    done(m)
  }

  m(i: I): Partial<O> | undefined {
    return undefined
  }
}
