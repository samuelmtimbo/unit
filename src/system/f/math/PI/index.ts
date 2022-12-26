import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_PI } from '../../../_ids'

export interface I<T> {
  any: any
}

export interface O<T> {
  pi: number
}

export default class PI<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['PI'],
      },
      {},
      system,
      ID_PI
    )
  }

  f({ any }: I<T>, done): void {
    done({ PI: Math.PI })
  }
}
