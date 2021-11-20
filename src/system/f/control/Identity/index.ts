import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Identity<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
      o: ['a'],
    })
  }

  f({ a }: Partial<I<T>>, done): void {
    done({ a })
  }
}
