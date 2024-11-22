import { MIMO } from '../../../../MIMO'
import { System } from '../../../../system'
import { ID_TO_FIXED } from '../../../_ids'

export interface I {
  str: string
  radix: number
}

export interface O {
  n: number
}

export default class ToFixed extends MIMO<I, O> {
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

  m({ str, radix }: I): Partial<O> | undefined {
    const n = Number.parseInt(str, radix)
    if (isNaN(n)) {
      throw 'invalid number string'
    } else {
      return {
        n,
      }
    }
  }
}
