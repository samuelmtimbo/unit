import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: string
  b: string
}

export interface O {
  ab: string
}

export default class Concat extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      config
    )
  }

  f({ a, b }: I, done): void {
    done({ ab: a + b })
  }
}
