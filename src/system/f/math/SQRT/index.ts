import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
}

export interface O<T> {
  '√a': number
}

export default class SQRT<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['√a'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    if (a < 0) {
      done(undefined, 'cannot square root negative number')
    } else {
      done({ '√a': Math.sqrt(a) })
    }
  }
}
