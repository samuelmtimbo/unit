import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_COS } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  'cos(a)': number
}

export default class Cos<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['cos(a)'],
      },
      {},
      system,
      ID_COS
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'cos(a)': Math.cos(a) })
  }
}
