import { Functional } from '../../../../Class/Functional'
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
  constructor() {
    super({
      i: ['a', 'start', 'count'],
      o: ['a', 'removed'],
    })
  }

  f(i: I<T>, done): void {
    done(remove(i))
  }
}
