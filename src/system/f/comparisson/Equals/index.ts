import { Functional } from '../../../../Class/Functional'
import isEqual from './f'

export interface I<T> {
  a: T
  b: T
}

export interface O {
  'a = b': boolean
}

export default class Equals<T> extends Functional<I<T>, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['a = b'],
    })
  }

  f({ a, b }: I<T>, done): void {
    done({
      'a = b': isEqual(a, b),
    })
  }
}
