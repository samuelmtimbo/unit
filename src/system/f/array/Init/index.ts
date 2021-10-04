import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  n: number
  a: T
}

export interface O<T> {
  'a[]': T[]
}

export default class Init<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['n', 'a'],
        o: ['a[]'],
      },
      config
    )
  }

  f({ a, n }: I<T>, done: Done<O<T>>): void {
    done({ 'a[]': new Array(n).fill(a) })
  }
}
