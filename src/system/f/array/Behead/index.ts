import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
}

export interface O<T> {
  a: T[]
  head: T
  test: boolean
}

export default class Behead<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['a', 'head'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I<T>, done): void {
    if (!a.length) {
      done(undefined, 'cannot behead empty array')
      return
    }

    const _a = [...a]

    const head = _a.shift()

    done({ a: _a, head })
  }
}
