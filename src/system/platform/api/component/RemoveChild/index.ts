import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { C } from '../../../../../interface/C'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  parent: C
  at: number
}

export interface O {}

export default class RemoveChild extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  f({ parent, at }: I, done: Done<O>): void {
    try {
      parent.removeChild(at)
      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
