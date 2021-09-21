import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T
}

export interface O<T> {}

export default class Void<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
      },
      config
    )
  }

  f({}, done: Done<O<T>>): void {
    done()
  }
}
