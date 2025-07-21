import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { evaluateBundleSpec } from '../../../../../spec/evaluate/evaluateBundleSpec'
import { fromBundle } from '../../../../../spec/fromBundle'
import { validateBundleSpec } from '../../../../../spec/validate'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { GraphBundle } from '../../../../../types/GraphClass'
import { ID_FROM_BUNDLE } from '../../../../_ids'

export interface I {
  bundle: BundleSpec
}

export interface O {
  graph: GraphBundle
}

export default class FromBundle extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['bundle'],
        o: ['graph'],
      },
      {
        output: {},
      },
      system,
      ID_FROM_BUNDLE
    )
  }

  f({ bundle }: I, done: Done<O>, fail: Fail): void {
    const { specs, classes } = this.__system

    let graph: GraphBundle

    evaluateBundleSpec(bundle, specs, classes)

    if (!validateBundleSpec(bundle)) {
      fail('invalid bundle spec')

      return
    }

    try {
      graph = fromBundle(bundle, this.__system.specs, {})
    } catch (err) {
      fail(err.message)

      return
    }

    done({ graph })
  }
}
