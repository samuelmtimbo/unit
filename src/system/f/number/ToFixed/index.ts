import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_TO_FIXED } from '../../../_ids'

export interface I {
  n: number
  digits: number
}

export interface O {
  str: string
}

export default class ToFixed extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['n', 'digits'],
        o: ['str'],
      },
      {},
      system,
      ID_TO_FIXED
    )
  }

  f({ n, digits }: I, done: Done<O>): void {
    const str = n.toFixed(digits)

    done({
      str,
    })
  }
}
