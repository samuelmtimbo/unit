import { MIMO } from '../../../../MIMO'
import { System } from '../../../../system'
import { ID_STRING_TO_FLOAT } from '../../../_ids'

export interface I {
  str: string
}

export interface O {
  n: number
}

export default class StringToFloat extends MIMO<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str'],
        o: ['n'],
      },
      {},
      system,
      ID_STRING_TO_FLOAT
    )
  }

  m({ str }: I): Partial<O> | undefined {
    const n = Number.parseFloat(str)
    if (isNaN(n)) {
      throw 'invalid number string'
    } else {
      return {
        n,
      }
    }
  }
}
