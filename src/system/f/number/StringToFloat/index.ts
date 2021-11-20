import { Config } from '../../../../Class/Unit/Config'
import { MIMO } from '../../../../MIMO'

export interface I {
  str: string
}

export interface O {
  n: number
}

export default class StringToFloat extends MIMO<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['str'],
        o: ['n'],
      },
      config
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
