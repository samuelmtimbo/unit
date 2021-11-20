import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: number
  b: number
}

export interface O {
  'a & b': number
}

export default class And extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a & b'],
      },
      config
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a & b': a & b })
  }
}
