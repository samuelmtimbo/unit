import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  min: number
}

export default class Min<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['min'],
    })
  }

  f({ a, b }: I<T>, done): void {
    done({ min: Math.min(a, b) })
  }
}
