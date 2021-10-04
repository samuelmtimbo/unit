import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: string
  regex: string
  replacement: string
}

export interface O {
  a: string
}

export default class Replace extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'regex', 'replacement'],
        o: ['a'],
      },
      config
    )
  }

  f({ a, regex, replacement }: I, done): void {
    done({ a: a.replace(new RegExp(regex, 'g'), replacement) })
  }
}
