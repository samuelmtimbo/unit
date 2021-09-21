import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T[]
}

export interface O<T> {
  a: T[]
  last: T
}

export default class Pop<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['a', 'last'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    if (a.length > 0) {
      const _a = [...a]
      const last = _a.pop()
      done({ a: _a, last })
    } else {
      done(undefined, 'cannot pop empty array')
    }
  }
}
