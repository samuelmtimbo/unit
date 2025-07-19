import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_ACOS } from '../../../_ids'

export interface I<T> {
  x: number
}

export interface O<T> {
  rad: number
}

export default class Acos<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['x'],
        o: ['rad'],
      },
      {},
      system,
      ID_ACOS
    )
  }

  f({ x }: I<T>, done): void {
    done({ rad: Math.acos(x) })
  }
}
