import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
  value: T
  start: number
  end: number
}

export interface O<T> {
  a: T[]
}

export default class Fill<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'value', 'start', 'end'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, value, start, end }: I<T>, done: Done<O<T>>): void {
    done({ a: a.fill(value, start, end) })
  }
}
