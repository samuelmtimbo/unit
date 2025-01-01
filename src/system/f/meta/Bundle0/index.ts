import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { BundleSpec } from '../../../../types/BundleSpec'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { clone } from '../../../../util/clone'
import { ID_BUNDLE_0 } from '../../../_ids'

export interface I<T> {
  unit: $U
  opt: {
    snapshot?: boolean
  }
}

export interface O<T> {
  bundle: BundleSpec
}

export default class Bundle0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'opt'],
        o: ['bundle'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_BUNDLE_0
    )
  }

  f({ unit, opt }: I<T>, done: Done<O<T>>): void {
    unit = Async(unit, ['U'], this.__system.async)

    const { snapshot = false } = opt

    unit.$getUnitBundleSpec({ deep: snapshot }, (bundle) => {
      bundle = clone(bundle)

      done({
        bundle,
      })
    })
  }
}
