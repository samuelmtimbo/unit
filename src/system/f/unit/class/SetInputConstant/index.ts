import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { getSpec } from '../../../../../spec/util'
import { deepSet_ } from '../../../../../deepSet'
import { fromUnitBundle } from '../../../../../spec/fromUnitBundle'
import { System } from '../../../../../system'
import { IO } from '../../../../../types/IO'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { clone } from '../../../../../util/clone'
import { weakMerge } from '../../../../../weakMerge'
import { ID_SET_PIN_CONSTANT } from '../../../../_ids'

export interface I<T> {
  unit: UnitBundle
  type: IO
  name: string
  constant: any
}

export interface O<T> {
  unit: UnitBundle
}

export default class SetPinConstant<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'type', 'name', 'constant'],
        o: ['unit'],
      },
      {},
      system,
      ID_SET_PIN_CONSTANT
    )
  }

  f({ unit, type, name, constant }: I<T>, done: Done<O<T>>): void {
    const { __bundle } = unit

    const {
      unit: { id },
    } = __bundle

    const specs = weakMerge(this.__system.specs, __bundle.specs ?? {})

    const spec = getSpec(specs, id)

    const { inputs = {}, outputs = {} } = spec

    if (type === 'input' && !inputs[name]) {
      done(undefined, 'input not found')

      return
    }

    if (type === 'output' && !outputs[name]) {
      done(undefined, 'output not found')

      return
    }

    const bundleClone = clone(__bundle)

    deepSet_(bundleClone, ['unit', type, name, 'constant'], constant)

    const NewBundle = fromUnitBundle(bundleClone, specs, this.__system.classes)

    done({ unit: NewBundle })
  }
}
