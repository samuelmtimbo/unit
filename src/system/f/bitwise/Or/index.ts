import { Functional } from '../../../../Class/Functional'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a | b': boolean
}

export default class And extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a | b'],
    })
  }

  f({ a, b }: I, done): void {
    done({ 'a | b': a || b })
  }
}
