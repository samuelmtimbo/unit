import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { cloneUnitBundle } from '../../../../../cloneUnitClass'
import { getSpec } from '../../../../../spec/util'
import { System } from '../../../../../system'
import { IO } from '../../../../../types/IO'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { weakMerge } from '../../../../../weakMerge'
import { ID_UNSET_PIN } from '../../../../_ids'
import Unit from '../../../meta/Unit'

export interface I<T extends Unit> {
  unit: UnitBundle<T>
  type: IO
  name: string
}

export interface O<T extends Unit> {
  unit: UnitBundle<T>
}

export default class UnsetPin<T extends Unit> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'type', 'name', 'data'],
        o: ['unit'],
      },
      {},
      system,
      ID_UNSET_PIN
    )
  }

  f({ unit, type, name }: I<T>, done: Done<O<T>>, fail: Fail): void {
    const {
      unit: { id },
      specs,
    } = unit.__bundle

    const specs_ = weakMerge(specs, this.__system.specs)

    const spec = getSpec(specs_, id)

    if (!spec[`${type}s`][name]) {
      fail(`${type} not found`)

      return
    }

    const NewBundle: UnitBundle = cloneUnitBundle(unit, specs)

    NewBundle.__bundle.unit.input = NewBundle.__bundle.unit.input || {}
    NewBundle.__bundle.unit.input[name] =
      NewBundle.__bundle.unit.input[name] || {}
    delete NewBundle.__bundle.unit.input[name].data

    done({ unit: NewBundle })
  }
}
