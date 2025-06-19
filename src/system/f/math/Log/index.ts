import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_LOG } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  'ln(a)': number
}

export default class Log<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['ln(a)'],
      },
      {},
      system,
      ID_LOG
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'ln(a)': Math.log(a) })
  }
}
