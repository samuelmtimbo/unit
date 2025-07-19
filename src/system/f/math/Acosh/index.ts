import { Functional } from '../../../../Class/Functional'
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

  f({ x }: I<T>, done): void {
    done({ rad: Math.acosh(x) })
  }
}
