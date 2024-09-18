import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { isBaseSpecId } from '../../../../client/id'
import { System } from '../../../../system'
import { GraphBundle } from '../../../../types/GraphClass'
import { weakMerge } from '../../../../weakMerge'
import { ID_GRAPH } from '../../../_ids'

export interface I<T> {
  unit: GraphBundle
}

export interface O<T> {
  graph: GraphBundle
}

export default class Graph1<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit'],
        o: ['graph'],
      },
      {},
      system,
      ID_GRAPH
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>): void {
    if (
      isBaseSpecId(
        weakMerge(this.__system.specs, unit.__bundle.specs),
        unit.__bundle.unit.id
      )
    ) {
      done(undefined, 'not a graph')

      return
    }

    done({
      graph: unit,
    })
  }
}
