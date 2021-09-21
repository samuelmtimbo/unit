import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: number
}

export interface O {
  '~a': number
}

export default class Not extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['~a'],
      },
      config
    )
  }

  f({ a }: I, done): void {
    done({ '~a': ~a })
  }
}
