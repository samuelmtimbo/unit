import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import slice from './f'

export interface I<T> {
  a: T[]
  begin: number
  end: number
}

export interface O<T> {
  a: T[]
}

export default class Slice<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'begin', 'end'],
        o: ['a'],
      },
      config
    )
  }

  f(i: I<T>, done: Done<O<T>>): void {
    done(slice(i))
  }
}
