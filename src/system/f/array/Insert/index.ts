import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
  i: number
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Insert<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'i', 'b'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, i, b }: I<T>, done): void {
    const _a = [...a]
    _a.splice(i, 0, b)
    done({ a: _a })
  }
}
