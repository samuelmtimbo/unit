import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  max: number
}

export default class Max<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['max'],
    })
  }

  f({ a, b }: I<T>, done): void {
    done({ max: Math.max(a, b) })
  }
}
