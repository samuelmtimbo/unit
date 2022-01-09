import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { G } from '../../../../interface/G'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  graph: G
  id: string
}

export interface O<T> {}

export default class RemoveUnit<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id', 'graph'],
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

  f(
    {
      id,
      graph,
    }: {
      class: UnitClass<any>
      graph: G
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
