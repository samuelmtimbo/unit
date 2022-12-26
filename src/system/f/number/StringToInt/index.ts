import { MIMO } from '../../../../MIMO'
import { System } from '../../../../system'
import { ID_STRING_TO_INT } from '../../../_ids'

export interface I {
  str: string
  radix: number
}

export interface O {
  n: number
}

export default class StringToNumber extends MIMO<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'radix'],
        o: ['n'],
      },
      {},
      system,
      ID_STRING_TO_INT
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
