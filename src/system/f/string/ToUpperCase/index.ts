import { Functional } from '../../../../Class/Functional'

export interface I {
  a: string
}

export interface O {
  A: string
}

export default class ToUpperCase extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['A'],
    })
  }

  f({ a }: I, done): void {
    done({ A: a.toUpperCase() })
  }
}
