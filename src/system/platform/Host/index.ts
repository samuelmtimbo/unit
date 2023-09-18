import { FunctionalEvents } from '../../../Class/Functional'
import { Unit } from '../../../Class/Unit'
import { System } from '../../../system'
import { Component_ } from '../../../types/interface/Component'
import { J } from '../../../types/interface/J'
import { ID_HOST } from '../../_ids'

export interface I {
  element: Component_
}

export interface O {}

export type _Context_EE = { _resize: [{ width: number; height: number }] }

export type _ContextEvents = FunctionalEvents<_Context_EE> & _Context_EE

export default class Host extends Unit<I, J, _ContextEvents> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_HOST
    )
  }
}
