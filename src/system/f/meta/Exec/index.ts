import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  unit: Unit
  method: string
  args: any[]
}

export interface O {
  return: any
}

export default class Exec extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['unit', 'method', 'args'],
        o: ['return'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  public f({ unit, method, args }: Partial<I>, done: Done<O>) {
    const f = unit[method]
    if (typeof f === 'function') {
      try {
        const _return = f.call(unit, ...args)
        done({ return: _return })
      } catch (err) {
        done(undefined, err.message)
      }
    } else {
      done(undefined, 'invalid method')
    }
  }
}
