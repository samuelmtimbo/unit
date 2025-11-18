import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_ACOSH } from '../../../_ids'

export interface I<T> {
  x: number
}

export interface O<T> {
  rad: number
}

export default class Acosh<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['x'],
        o: ['rad'],
      },
      {},
      system,
      ID_ACOSH
    )
  }

  f({ x }: I<T>, done: Done<O<T>>, fail: Fail): void {
    if (x === 0) {
      fail('cannot calculate the inverse hyperbolic cosine of 0')

      return
    }

    done({ rad: Math.acosh(x) })
  }
}
