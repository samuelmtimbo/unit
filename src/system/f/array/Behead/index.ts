import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T[]
}

export interface O<T> {
  a: T[]
  head: T
}

export default class Head<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['a', 'head'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    const _a = [...a]
    const head = _a.shift()
    done({ a: _a, head })
  }
}
