import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { cloneUnitBundle } from '../../../../cloneUnitClass'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { UnitBundle } from '../../../../types/UnitBundle'
import Unit from '../../meta/Unit'

export interface I<T extends Unit> {
  unit: UnitBundle<T>
  type: IO
  name: string
}

export interface O<T extends Unit> {
  unit: UnitBundle<T>
}

export default class TakePinData<T extends Unit> extends Functional<
  I<T>,
  O<T>
> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['unit', 'type', 'name', 'data'],
        o: ['unit'],
      },
      {},
      system,
      pod
    )
  }

  f({ unit, type, name }: I<T>, done: Done<O<T>>): void {
    const {
      unit: { id },
      specs,
    } = unit.__bundle

    const spec = getSpec({ ...specs, ...this.__system.specs }, id)

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
