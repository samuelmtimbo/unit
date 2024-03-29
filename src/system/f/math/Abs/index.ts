import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_ABS } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  '|a|': number
}

export default class Abs<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['|a|'],
      },
      {},
      system,
      ID_ABS
    )
  }

  f({ a }: I<T>, done): void {
    done({ '|a|': Math.abs(a) })
  }
}
