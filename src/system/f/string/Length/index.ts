import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: string
}

export interface O {
  length: number
}

export default class Length extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['length'],
      },
      config
    )
  }

  f({ a }: I, done): void {
    done({ length: a.length })
  }
}
