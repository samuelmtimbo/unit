import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { cloneUnitBundle } from '../../../../cloneUnitClass'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { UnitBundle } from '../../../../types/UnitBundle'
import { weakMerge } from '../../../../weakMerge'
import { ID_UNSET_PIN } from '../../../_ids'
import Unit from '../../meta/Unit'

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

  f({ unit, type, name }: I<T>, done: Done<O<T>>): void {
    const {
      unit: { id },
      specs,
    } = unit.__bundle

    const spec = getSpec(weakMerge(specs, this.__system.specs), id)

    if (!spec[`${type}s`][name]) {
      done(undefined, `${type} not found`)

      return
    }

    const NewBundle: UnitBundle = cloneUnitBundle(unit)

    NewBundle.__bundle.unit.input = NewBundle.__bundle.unit.input || {}
    NewBundle.__bundle.unit.input[name] =
      NewBundle.__bundle.unit.input[name] || {}
    delete NewBundle.__bundle.unit.input[name].data

    done({ unit: NewBundle })
  }
}
