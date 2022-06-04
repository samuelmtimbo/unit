import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { cloneBundle } from '../../../../../spec/cloneBundle'
import { System } from '../../../../../system'
import { C } from '../../../../../types/interface/C'
import { Component_ } from '../../../../../types/interface/Component'
import { UnitBundle } from '../../../../../types/UnitBundle'

export interface I {
  parent: C
  at: number
}

export interface O {
  unit: UnitBundle<Component_>
}

export default class RemoveChild extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['parent', 'at'],
        o: ['unit'],
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
    let unit: UnitBundle<Component_>

    try {
      const child = parent.removeChild(at)

      unit = cloneBundle(child)
    } catch (err) {
      done(undefined, err.message)
    }

    done({
      unit,
    })
  }
}
