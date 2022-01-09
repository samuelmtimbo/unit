import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
}

export interface O<T> {
  a: T[]
  last: T
}

export default class Pop<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['a', 'last'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I<T>, done): void {
    if (a.length > 0) {
      const _a = [...a]
      const last = _a.pop()
      done({ a: _a, last })
    } else {
      done(undefined, 'cannot pop empty array')
    }
  }
}
