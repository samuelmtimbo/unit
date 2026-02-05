import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_ASIN } from '../../../_ids'

export interface I<T> {
  x: number
}

export interface O<T> {
  rad: number
}

export default class Asin<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['x'],
        o: ['rad'],
      },
      {},
      system,
      ID_ASIN
    )
  }

  f({ x }: I<T>, done: Done<O<T>>, fail: Fail): void {
    if (Math.abs(x) > 1) {
      fail('invalid sin value')

      return
    }

    const rad = Math.asin(x)

    done({ rad })
  }
}
