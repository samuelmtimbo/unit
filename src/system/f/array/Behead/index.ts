import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_BEHEAD } from '../../../_ids'

export interface I<T> {
  a: T[]
}

export interface O<T> {
  a: T[]
  head: T
  test: boolean
}

export default class Behead<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['a', 'head'],
      },
      {},
      system,
      ID_BEHEAD
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
