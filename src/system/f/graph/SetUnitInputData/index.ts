import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { ID_SET_UNIT_PIN_DATA } from '../../../_ids'

export interface I<T> {
  graph: Graph
  id: string
  type: IO
  name: string
  data: any
}

export interface O<T> {}

export default class SetUnitPinData<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'id', 'type', 'name', 'data'],
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
      ID_SET_UNIT_PIN_DATA
    )
  }

  f({ graph, id, type, name, data }: I<T>, done: Done<O<T>>): void {
    try {
      graph.setUnitPinData(id, type, name, data)

      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
