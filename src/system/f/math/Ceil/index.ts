import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_CEIL } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  '⌈a⌉': number
}

export default class Ceil<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['⌈a⌉'],
      },
      {},
      system,
      ID_CEIL
    )
  }

  f({ a }: I<T>, done): void {
    done({ '⌈a⌉': Math.ceil(a) })
  }
}
