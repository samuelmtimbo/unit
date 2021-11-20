import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: T[]
  b: T[]
}

export interface O<T> {
  ab: T[]
}

export default class Concat<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['ab'],
    })
  }

  f({ a, b }: I<T>, done): void {
    done({ ab: a.concat(b) })
  }
}
