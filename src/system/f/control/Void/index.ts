import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I<T> {
  a: T
}

export interface O<T> {}

export default class Void<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
    })
  }

  f({}, done: Done<O<T>>): void {
    done()
  }
}
