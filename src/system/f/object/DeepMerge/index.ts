import { MIMO } from '../../../../MIMO'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
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
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      {},
      system,
      pod
    )
  }

  m({ a, b }: I): Dict<object> {
    return { ab: deepMerge({ ...a }, b) }
  }
}
