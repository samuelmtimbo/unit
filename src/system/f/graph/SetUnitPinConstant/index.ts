import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { ID_SET_UNIT_PIN_CONSTANT } from '../../../_ids'

export interface I<T> {
  graph: Graph
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
      ID_SET_UNIT_PIN_CONSTANT
    )
  }

  f({ graph, id, type, name, constant }: I<T>, done: Done<O<T>>): void {
    try {
      graph.setUnitPinConstant(id, type, name, constant)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
