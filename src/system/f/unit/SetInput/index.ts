import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { cloneUnitBundle } from '../../../../cloneUnitClass'
import { Pod } from '../../../../pod'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'

export interface I<T> {
  unit: UnitBundle
  name: string
  data: any
}

export interface O<T> {
  unit: UnitBundle
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

    const NewBundle: UnitBundle = cloneUnitBundle(unit)

    NewBundle.__bundle.unit.input = NewBundle.__bundle.unit.input || {}
    NewBundle.__bundle.unit.input[name] =
      NewBundle.__bundle.unit.input[name] || {}
    NewBundle.__bundle.unit.input[name].data = stringify(data) // XABLEAU

    done({ unit: NewBundle })
  }
}
