import { Functional } from '../../../../Class/Functional'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a and b': boolean
}

export default class And extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a and b'],
    })
  }

  f({ a, b }: I, done): void {
    done({ 'a and b': a && b })
  }
}
