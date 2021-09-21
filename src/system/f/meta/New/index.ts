import { Functional } from '../../../../Class/Functional'
import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  class: UnitClass<any>
}

export interface O<T> {
  unit: Unit<any, any>
}

export default class New<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['class'],
        o: ['unit'],
      },
      config
    )
  }

  f({ class: Class }: I<T>, done): void {
    done({ unit: new Class() })
  }
}
