import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { S } from '../../../../types/interface/S'
import { wrapSystem } from '../../../../wrap/System'
import { ID_SPEC } from '../../../_ids'

export interface I<T> {}

export interface O<T> {
  system: S
}

export default class System_<T> extends Unit<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: ['system'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_SPEC
    )

    this._output.system.push(wrapSystem(system, system))
  }
}
