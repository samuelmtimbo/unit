import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: T
  signal: any
}

export interface O<T> {
  a: T
}

export default class Wait<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a'],
    })
  }

  f({ a }: I<T>, done): void {
    done({ a })
  }
}
