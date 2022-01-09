import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { cloneUnitClass } from '../../../../cloneUnitClass'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  unit: UnitClass
  type: IO
  name: string
}

export interface O<T> {
  unit: UnitClass
}

export default class TakePinData<T> extends Functional<I<T>, O<T>> {
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

    const next_unit: UnitClass = cloneUnitClass(unit)

    next_unit.__bundle.unit.input = next_unit.__bundle.unit.input || {}
    next_unit.__bundle.unit.input[name] =
      next_unit.__bundle.unit.input[name] || {}
    delete next_unit.__bundle.unit.input[name].data

    done({ unit: next_unit })
  }
}
