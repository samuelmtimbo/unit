import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_POW } from '../../../_ids'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  'a ** b': number
}

export default class Pow<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a ** b'],
      },
      {},
      system,
      ID_POW
    )
  }

  f({ a, b }: I<T>, done: Done<O<T>>): void {
    done({ 'a ** b': Math.pow(a, b) })
  }
}
