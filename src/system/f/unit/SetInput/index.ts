import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { cloneUnitClass } from '../../../../cloneUnitClass'
import { Pod } from '../../../../pod'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  unit: UnitClass
  name: string
  data: any
}

export interface O<T> {
  unit: UnitClass
}

export default class SetInput<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['unit', 'name', 'data'],
        o: ['unit'],
      },
      {},
      system,
      pod
    )
  }

  f({ unit, name, data }: I<T>, done: Done<O<T>>): void {
    const { id } = unit.__bundle.unit

    const spec = getSpec(this.__system.specs, id)

    const { inputs = {} } = spec

    if (!inputs[name]) {
      done(undefined, 'input not found')
      return
    }

    const next_unit: UnitClass = cloneUnitClass(unit)

    next_unit.__bundle.unit.input = next_unit.__bundle.unit.input || {}
    next_unit.__bundle.unit.input[name] =
      next_unit.__bundle.unit.input[name] || {}
    next_unit.__bundle.unit.input[name].data = stringify(data) // TODO

    done({ unit: next_unit })
  }
}
