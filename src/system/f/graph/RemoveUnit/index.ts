import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { Config } from '../../../../Class/Unit/Config'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  graph: Graph
  id: string
}

export interface O<T> {}

export default class RemoveUnit<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['id', 'graph'],
        o: [],
      },
      config
    ),
      {
        input: {
          graph: {
            ref: true,
          },
        },
      }
  }

  f(
    {
      id,
      graph,
    }: {
      class: UnitClass<any>
      graph: Graph
      id: string
    },
    done: Done<O<T>>
  ): void {
    try {
      graph.removeUnit(id)
      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
