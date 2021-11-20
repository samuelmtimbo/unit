import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  A: string
}

export interface O {
  a: string
}

export default class ToLowerCase extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['A'],
        o: ['a'],
      },
      config
    )
  }

  f({ A }: I, done): void {
    done({ a: A.toLowerCase() })
  }
}
