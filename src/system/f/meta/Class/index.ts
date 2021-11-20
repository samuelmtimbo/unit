import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { U } from '../../../../interface/U'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  unit: U
}

export interface O<T> {
  class: UnitClass<any>
}

export default class Class<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super(
      {
        i: ['unit', 'any'],
        o: ['class'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      }
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>): void {
    const Class = unit.constructor as UnitClass
    done({ class: Class })
  }
}
