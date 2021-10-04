import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: string
  from: number
  length: number
}

export interface O {
  a: string
}

export default class Substr extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'from', 'length'],
        o: ['a'],
      },
      config
    )
  }

  f({ a, from, length }: I, done): void {
    done({ a: a.substr(from, length) })
  }
}
