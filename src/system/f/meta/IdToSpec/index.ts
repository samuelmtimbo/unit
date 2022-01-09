import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Spec } from '../../../../types'

export interface I<T> {
  id: string
}

export interface O<T> {
  spec: Spec
}

export default class IdToSpec<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id'],
        o: ['spec'],
      },
      {},
      system,
      pod
    )
  }

  f({ id }: I<T>, done: Done<O<T>>): void {
    if (this.__system) {
      const { specs } = this.__system

      const spec = specs[id]

      if (spec) {
        done({ spec })
      } else {
        done(undefined, 'cannot find spec with this id')
      }
    } else {
      done(undefined, 'not attached')
    }
  }
}
