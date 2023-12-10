import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { getSpec } from '../../../../client/spec'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { weakMerge } from '../../../../weakMerge'
import { ID_HAS_INPUT } from '../../../_ids'

export interface I<T> {
  unit: UnitBundle
  name: string
}

export interface O<T> {
  test: boolean
}

export default class HasInput<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'name'],
        o: ['test'],
      },
      {},
      system,
      ID_HAS_INPUT
    )
  }

  f({ unit, name }: I<T>, done: Done<O<T>>): void {
    const { id } = unit.__bundle.unit

    const spec = getSpec(
      weakMerge(this.__system.specs, unit.__bundle.specs ?? {}),
      id
    )

    const { inputs = {} } = spec

    const test = !!inputs[name]

    done({ test })
  }
}
