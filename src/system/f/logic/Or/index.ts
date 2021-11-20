import { Functional } from '../../../../Class/Functional'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a or b': boolean
}

export default class And extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a or b'],
    })
  }

  f({ a, b }: I, done): void {
    done({ 'a or b': a || b })
  }
}
