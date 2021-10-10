import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T[]
  i: number
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Insert<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'i', 'b'],
        o: ['a'],
      },
      config
    )
  }

  f({ a, i, b }: I<T>, done): void {
    const _a = [...a]
    _a.splice(i, 0, b)
    done({ a: _a })
  }
}
