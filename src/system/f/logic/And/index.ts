import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a and b': boolean
}

export default class And extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a and b'],
      },
      config
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a and b': a && b })
  }
}
