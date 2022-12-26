import { MIMO } from '../../../../MIMO'
import { System } from '../../../../system'
import { ID_NUMBER_TO_STRING } from '../../../_ids'

export interface I {
  n: number
  radix?: number
}

export interface O {
  str: string
}

export default class NumberToString extends MIMO<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['n', 'radix'],
        o: ['str'],
      },
      {},
      system,
      ID_NUMBER_TO_STRING
    )
  }

  m({ n, radix }: I): Partial<O> | undefined {
    return {
      str: n.toString(radix),
    }
  }
}
