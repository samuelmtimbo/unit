import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_IF } from '../../../_ids'

export interface I<T> {
  a: T
  b: boolean
}

export interface O<T> {
  'a if b': T
}

export default class If<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a if b'],
      },
      {},
      system,
      ID_IF
    )
  }

  f({ a, b }: I<T>, done): void {
    // console.log('If', 'f')
    if (b === true) {
      done({ 'a if b': a })
    } else {
      done({ 'a if b': undefined })
    }
  }
}
