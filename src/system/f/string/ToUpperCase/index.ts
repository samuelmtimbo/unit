import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: string
}

export interface O {
  A: string
}

export default class ToUpperCase extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['A'],
      },
      config
    )
  }

  f({ a }: I, done): void {
    done({ A: a.toUpperCase() })
  }
}
