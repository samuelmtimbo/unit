import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import length from './f'

export interface I<T> {
  a: T[]
}

export interface O {
  length: number
}

export default class Length<T> extends Functional<I<T>, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['length'],
    })
  }

  f(i: I<T>, done: Done<O>): void {
    done(length(i))
  }
}
