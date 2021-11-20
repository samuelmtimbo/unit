import { Functional } from '../../../../Class/Functional'

export interface I {
  a: number
}

export interface O {
  '~a': number
}

export default class Not extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['~a'],
    })
  }

  f({ a }: I, done): void {
    done({ '~a': ~a })
  }
}
