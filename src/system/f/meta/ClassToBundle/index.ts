import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { UnitBundleSpec } from '../../../../types/UnitBundleSpec'
import { ID_CLASS_TO_BUNDLE } from '../../../_ids'

export interface I<T> {
  class: UnitBundle<any>
}

export interface O<T> {
  bundle: UnitBundleSpec
}

export default class ClassToBundle<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['class'],
        o: ['bundle'],
      },
      {},
      system,
      ID_CLASS_TO_BUNDLE
    )
  }

  f({ class: Class }: I<T>, done: Done<O<T>>): void {
    const { __bundle } = Class

    done({ bundle: __bundle })
  }
}
