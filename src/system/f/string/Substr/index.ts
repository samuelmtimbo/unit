import { Functional } from '../../../../Class/Functional'

export interface I {
  a: string
  from: number
  length: number
}

export interface O {
  a: string
}

export default class Substr extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'from', 'length'],
      o: ['a'],
    })
  }

  f({ a, from, length }: I, done): void {
    done({ a: a.substr(from, length) })
  }
}
