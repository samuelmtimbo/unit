import { MIMO } from '../../../../MIMO'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  str: string
}

export interface O {
  n: number
}

export default class StringToFloat extends MIMO<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['str'],
        o: ['n'],
      },
      {},
      system,
      pod
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
