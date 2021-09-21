import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T[]
  i: number
}

export interface O<T> {
  'a[i]': T
}

export default class At<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'i'],
        o: ['a[i]'],
      },
      config
    )
  }

  f({ a, i }: I<T>, done: Done<O<T>>): void {
    if (i >= 0 && i < a.length) {
      done({ 'a[i]': a[i] })
    } else {
      done(undefined, 'index out of boundary')
    }
  }
}
