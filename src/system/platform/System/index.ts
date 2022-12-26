import { Graph } from '../../../Class/Graph'
import { Unit } from '../../../Class/Unit'
import { System } from '../../../system'
import { Dict } from '../../../types/Dict'
import { GraphBundle } from '../../../types/GraphClass'
import { S } from '../../../types/interface/S'
import { Unlisten } from '../../../types/Unlisten'
import { _newSystem } from '../../../wrap/System'
import { ID_SYSTEM } from '../../_ids'

export interface I<T> {}

export interface O<T> {}

export default class _System<T> extends Unit<I<T>, O<T>> implements S {
  constructor(system: System) {
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
      ID_SYSTEM
    )
  }

  newGraph(
    bundle: GraphBundle<any, any>
  ): [Dict<string>, Graph<any, any>, Unlisten] {
    throw new Error('Method not implemented.')
  }

  newSystem(opt: {}): [S, Unlisten] {
    return _newSystem(this.__system, this.__system)
  }
}
