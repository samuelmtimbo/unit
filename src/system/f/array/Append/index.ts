import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I<T> {
  a: T[]
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Append<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a'],
    })
  }

  f({ a, b }: I<T>, done: Done<O<T>>): void {
    done({ a: [...a, b] })
  }
}
