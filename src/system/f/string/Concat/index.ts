import { Functional } from '../../../../Class/Functional'

export interface I {
  a: string
  b: string
}

export interface O {
  ab: string
}

export default class Concat extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['ab'],
    })
  }

  f({ a, b }: I, done): void {
    done({ ab: a + b })
  }
}
