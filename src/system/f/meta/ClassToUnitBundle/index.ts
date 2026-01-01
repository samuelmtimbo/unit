import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { UnitBundleSpec } from '../../../../types/UnitBundleSpec'
import { ID_CLASS_TO_UNIT_BUNDLE } from '../../../_ids'

export interface I<T> {
  class: UnitBundle<any>
}

export interface O<T> {
  unit: UnitBundleSpec
}

export default class ClassToUnitBundle<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['class'],
        o: ['unit'],
      },
      {},
      system,
      ID_CLASS_TO_UNIT_BUNDLE
    )
  }

  f({ class: Class }: I<T>, done: Done<O<T>>): void {
    const { __bundle } = Class

    done({ unit: __bundle })
  }
}
