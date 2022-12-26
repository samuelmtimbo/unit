import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_SIN } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sin(a)': number
}

export default class Sin<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['sin(a)'],
      },
      {},
      system,
      ID_SIN
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'sin(a)': Math.sin(a) })
  }
}
