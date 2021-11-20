import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'

export interface I<T> {
  graph: Graph
  id: string
  type: 'input' | 'output'
  name: string
  data: any
}

export interface O<T> {}

export default class SetUnitPinData<T> extends Functional<I<T>, O<T>> {
  constructor() {
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
      }
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
