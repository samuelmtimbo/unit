import { Functional } from '../../../../Class/Functional'

export interface I {
  a: number
  b: number
}

export interface O {
  'a ≤ b': boolean
}

export default class LessThanEqual extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a ≤ b'],
    })
  }

  f({ a, b }: I, done): void {
    done({ 'a ≤ b': a <= b })
  }
}
