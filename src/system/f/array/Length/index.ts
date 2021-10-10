import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import length from './f'

export interface I<T> {
  a: T[]
}

export interface O {
  length: number
}

export default class Length<T> extends Functional<I<T>, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['length'],
      },
      config
    )
  }

  f(i: I<T>, done: Done<O>): void {
    done(length(i))
  }
}
