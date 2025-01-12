import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_POP_0 } from '../../../../_ids'

export interface I<T> {
  a: A<T>
  any: any
}

export interface O<T> {
  last: T
}

export default class Pop<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'any'],
        o: ['last'],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
      },
      system,
      ID_POP_0
    )
  }

  async f({ a }: I<T>, done: Done<O<T>>): Promise<void> {
    let last: T

    try {
      last = await a.pop()
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ last })
  }
}
