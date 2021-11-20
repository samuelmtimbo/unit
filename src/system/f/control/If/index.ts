import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T
  b: boolean
}

export interface O<T> {
  'a if b': T
}

export default class If<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a if b'],
      },
      config
    )
  }

  f({ a, b }: I<T>, done): void {
    // console.log('If', 'f')
    if (b === true) {
      done({ 'a if b': a })
    } else {
      done({ 'a if b': undefined })
    }
  }
}
