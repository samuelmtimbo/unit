import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { fromUnitBundle } from '../../../../../spec/fromUnitBundle'
import { validateUnitBundleSpec } from '../../../../../spec/validate'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { UnitBundleSpec } from '../../../../../types/UnitBundleSpec'
import { ID_FROM_UNIT_BUNDLE } from '../../../../_ids'

export interface I {
  bundle: UnitBundleSpec
}

export interface O {
  unit: UnitBundle
}

export default class FromUnitBundle extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['bundle'],
        o: ['unit'],
      },
      {
        output: {},
      },
      system,
      ID_FROM_UNIT_BUNDLE
    )
  }

  f({ bundle }: I, done: Done<O>): void {
    let unit: GraphBundle

    if (!validateUnitBundleSpec(bundle)) {
      done(undefined, 'invalid bundle spec')

      return
    }

    try {
      unit = fromUnitBundle(bundle, this.__system.specs, {})
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ unit })
  }
}
