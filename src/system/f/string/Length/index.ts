import { Functional } from '../../../../Class/Functional'

export interface I {
  a: string
}

export interface O {
  length: number
}

export default class Length extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['length'],
    })
  }

  f({ a }: I, done): void {
    done({ length: a.length })
  }
}
