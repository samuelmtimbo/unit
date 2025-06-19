import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_SIN } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  'tan(a)': number
}

export default class Tan<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['tan(a)'],
      },
      {},
      system,
      ID_SIN
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'tan(a)': Math.tan(a) })
  }
}
