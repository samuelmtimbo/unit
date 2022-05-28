import { Unit } from '../../../Class/Unit'
import { Pod } from '../../../pod'
import { System } from '../../../system'
import { P } from '../../../types/interface/P'
import { S } from '../../../types/interface/S'
import { Unlisten } from '../../../types/Unlisten'
import { _newPod, _newSystem } from '../../../wrap/System'

export interface I<T> {}

export interface O<T> {}

export default class _System<T> extends Unit<I<T>, O<T>> implements S {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: [],
        o: [],
      },
      {
        output: {
          system: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  newSystem(opt: {}): [S, Unlisten] {
    return _newSystem(this.__system, this.__system, this.__pod)
  }

  newPod(): [P, Unlisten] {
    return _newPod(this.__system, this.__system, this.__pod)
  }
}
