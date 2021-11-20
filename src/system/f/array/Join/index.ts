import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: string[]
  sep: string
}

export interface O {
  str: string
}

export default class Join extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'sep'],
        o: ['str'],
      },
      config
    )
  }

  f({ a, sep }: I, done): void {
    const str = a.join(sep)
    done({ str })
  }
}
