import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I<T> {
  n: number
  a: T
}

export interface O<T> {
  'a[]': T[]
}

export default class Init<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['n', 'a'],
      o: ['a[]'],
    })
  }

  f({ a, n }: I<T>, done: Done<O<T>>): void {
    done({ 'a[]': new Array(n).fill(a) })
  }
}
