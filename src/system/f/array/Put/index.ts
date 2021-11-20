import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I<T> {
  a: T[]
  v: T
  i: number
}

export interface O<T> {
  a: T[]
}

export default class Put<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'v', 'i'],
      o: ['a'],
    })
  }

  f({ a, v, i }: I<T>, done: Done<O<T>>): void {
    if (i < a.length) {
      const b = [...a]
      b[i] = v
      done({ a: b })
    } else {
      done(undefined, 'index out of boundary')
    }
  }
}
