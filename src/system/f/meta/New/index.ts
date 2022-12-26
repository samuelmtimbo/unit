import { Functional } from '../../../../Class/Functional'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_NEW } from '../../../_ids'

export interface I<T> {
  class: UnitBundle<any>
}

export interface O<T> {
  unit: Unit<any, any>
}

export default class New<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['class'],
        o: ['unit'],
      },
      {
        output: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_NEW
    )
  }

  f({ class: Class }: I<T>, done): void {
    done({ unit: new Class(this.__system) })
  }
}
