import { MIMO } from '../../../../MIMO'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  str: string
  radix: number
}

export interface O {
  n: number
}

export default class StringToNumber extends MIMO<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['str', 'radix'],
        o: ['n'],
      },
      {},
      system,
      pod
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
