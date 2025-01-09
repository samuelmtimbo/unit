import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { getSpec } from '../../../../../client/spec'
import { deepSet_ } from '../../../../../deepSet'
import { evaluateData } from '../../../../../spec/evaluateDataValue'
import { fromUnitBundle } from '../../../../../spec/fromUnitBundle'
import { System } from '../../../../../system'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { clone } from '../../../../../util/clone'
import { weakMerge } from '../../../../../weakMerge'
import { ID_SET_INPUT } from '../../../../_ids'

export interface I<T> {
  unit: UnitBundle
  name: string
  data: any
}

export interface O<T> {
  unit: UnitBundle
}

export default class SetInput<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'name', 'data'],
        o: ['unit'],
      },
      {},
      system,
      ID_SET_INPUT
    )
  }

  f({ unit, name, data }: I<T>, done: Done<O<T>>): void {
    const { __bundle } = unit

    const {
      unit: { id },
    } = __bundle

    const specs = weakMerge(this.__system.specs, __bundle.specs ?? {})

    const spec = getSpec(specs, id)

    const { inputs = {} } = spec

    if (!inputs[name]) {
      done(undefined, 'input not found')

      return
    }

    const bundleClone = clone(__bundle)

    deepSet_(
      bundleClone,
      ['unit', 'input', name, 'data'],
      evaluateData(data, specs, this.__system.classes)
    )

    const NewBundle = fromUnitBundle(bundleClone, specs, this.__system.classes)

    done({ unit: NewBundle })
  }
}
