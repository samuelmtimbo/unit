import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
}

export interface O<T> {
  '⌊a⌋': number
}

export default class Floor<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
      o: ['⌊a⌋'],
    })
  }

  f({ a }: I<T>, done): void {
    done({ '⌊a⌋': Math.floor(a) })
  }
}
