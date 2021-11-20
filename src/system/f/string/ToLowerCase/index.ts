import { Functional } from '../../../../Class/Functional'

export interface I {
  A: string
}

export interface O {
  a: string
}

export default class ToLowerCase extends Functional<I, O> {
  constructor() {
    super({
      i: ['A'],
      o: ['a'],
    })
  }

  f({ A }: I, done): void {
    done({ a: A.toLowerCase() })
  }
}
