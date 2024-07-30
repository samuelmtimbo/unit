import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { ID_DESTROY } from '../../../_ids'

export interface I {
  unit: Unit
  any: any
}

export interface O {}

export default class Destroy extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'any'],
        o: [],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_DESTROY
    )
  }

  f({ unit }, done: Done<O>) {
    unit.destroy()

    done()
  }
}
