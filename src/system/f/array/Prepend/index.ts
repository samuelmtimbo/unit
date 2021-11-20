import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: T[]
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Prepend<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a'],
    })
  }

  f({ a, b }: I<T>, done): void {
    done({ a: [b, ...a] })
  }
}
