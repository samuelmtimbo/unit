import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
}

export interface O<T> {
  '√a': number
}

export default class SQRT<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
      o: ['√a'],
    })
  }

  f({ a }: I<T>, done): void {
    if (a < 0) {
      done(undefined, 'cannot square root negative number')
    } else {
      done({ '√a': Math.sqrt(a) })
    }
  }
}
