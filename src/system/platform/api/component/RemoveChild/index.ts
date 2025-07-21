import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { C } from '../../../../../types/interface/C'
import { ID_REMOVE_CHILD } from '../../../../_ids'

export interface I {
  parent: C
  at: number
}

export interface O {}

export default class RemoveChild extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['parent', 'at'],
        o: [],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
      },
      system,
      ID_REMOVE_CHILD
    )
  }

  f({ parent, at }: I, done: Done<O>, fail: Fail): void {
    try {
      const child = parent.removeChild(at)

      child.destroy()
    } catch (err) {
      fail(err.message)

      return
    }

    done({})
  }
}
