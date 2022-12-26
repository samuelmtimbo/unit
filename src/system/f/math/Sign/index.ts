import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_SIGN } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sign(a)': number
}

export default class Sign<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['sign(a)'],
      },
      {},
      system,
      ID_SIGN
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'sign(a)': Math.sign(a) })
  }
}
