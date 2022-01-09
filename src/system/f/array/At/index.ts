import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
  i: number
}

export interface O<T> {
  'a[i]': T
}

export default class At<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'i'],
        o: ['a[i]'],
      },
      {},
      system,
      pod
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
