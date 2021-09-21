import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'
import remove from './f'

export interface I<T> {
  a: T[]
  start: number
  count: number
}

export interface O<T> {
  a: T[]
  removed: T[]
}

export default class Remove<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'start', 'count'],
        o: ['a', 'removed'],
      },
      config
    )
  }

  f(i: I<T>, done): void {
    done(remove(i))
  }
}
