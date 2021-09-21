import { Config } from '../../../../Class/Unit/Config'
import { MIMO } from '../../../../MIMO'

export interface I {
  n: number
  radix?: number
}

export interface O {
  str: string
}

export default class NumberToString extends MIMO<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['n', 'radix'],
        o: ['str'],
      },
      config
    )
  }

  m({ n, radix }: I): Partial<O> | undefined {
    return {
      str: n.toString(radix),
    }
  }
}
