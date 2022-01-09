import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  n: number
  a: T
}

export interface O<T> {
  'a[]': T[]
}

export default class Init<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['n', 'a'],
        o: ['a[]'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, n }: I<T>, done: Done<O<T>>): void {
    done({ 'a[]': new Array(n).fill(a) })
  }
}
