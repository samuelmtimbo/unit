import { MIMO } from '../../../../MIMO'
import { Dict } from '../../../../types/Dict'
import deepMerge from './f'

export interface I {
  a: object
  b: object
}

export interface O {
  ab: object
}

export default class DeepMerge extends MIMO<I, O> {
  constructor() {
    super({
      i: ['a', 'b'],
      o: ['ab'],
    })
  }

  m({ a, b }: I): Dict<object> {
    return { ab: deepMerge({ ...a }, b) }
  }
}
