import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_SQRT } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  '√a': number
}

export default class SQRT<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['√a'],
      },
      {},
      system,
      ID_SQRT
    )
  }

  f({ a }: I<T>, done): void {
    if (a < 0) {
      done(undefined, 'cannot square root negative number')
    } else {
      done({ '√a': Math.sqrt(a) })
    }
  }
}
