import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'

export interface I<T> {
  graph: Graph
  id: string
  type: IO
  name: string
  data: any
}

export interface O<T> {}

export default class SetUnitPinData<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
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
