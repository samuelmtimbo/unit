import { MIMO } from '../../../../MIMO'

export interface I {
  n: number
  radix?: number
}

export interface O {
  str: string
}

export default class NumberToString extends MIMO<I, O> {
  constructor() {
    super({
      i: ['n', 'radix'],
      o: ['str'],
    })
  }

  m({ n, radix }: I): Partial<O> | undefined {
    return {
      str: n.toString(radix),
    }
  }
}
