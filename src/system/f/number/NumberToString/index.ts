import { MIMO } from '../../../../MIMO'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  n: number
  radix?: number
}

export interface O {
  str: string
}

export default class NumberToString extends MIMO<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['n', 'radix'],
        o: ['str'],
      },
      {},
      system,
      pod
    )
  }

  m({ n, radix }: I): Partial<O> | undefined {
    return {
      str: n.toString(radix),
    }
  }
}
