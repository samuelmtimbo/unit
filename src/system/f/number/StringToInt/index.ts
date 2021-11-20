import { Config } from '../../../../Class/Unit/Config'
import { MIMO } from '../../../../MIMO'

export interface I {
  str: string
  radix: number
}

export interface O {
  n: number
}

export default class StringToNumber extends MIMO<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['str', 'radix'],
        o: ['n'],
      },
      config
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
