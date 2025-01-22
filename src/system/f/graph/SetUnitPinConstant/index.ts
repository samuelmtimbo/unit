import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_SET_UNIT_PIN_CONSTANT_0 } from '../../../_ids'

export interface I<T> {
  graph: $G
  id: string
  type: IO
  name: string
  constant: any
}

export interface O<T> {}

export default class SetUnitPinConstant<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'id', 'type', 'name', 'constant'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_UNIT_PIN_CONSTANT_0
    )
  }

  f({ graph, id, type, name, constant }: I<T>, done: Done<O<T>>): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$setUnitPinConstant({ unitId: id, type, pinId: name, constant })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
