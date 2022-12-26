import { MIMO } from '../../../../MIMO'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_DEEP_MERGE } from '../../../_ids'
import deepMerge from './f'

export interface I {
  a: object
  b: object
}

export interface O {
  ab: object
}

export default class DeepMerge extends MIMO<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      {},
      system,
      ID_DEEP_MERGE
    )
  }

  m({ a, b }: I): Dict<object> {
    return { ab: deepMerge(a, b) }
  }
}
