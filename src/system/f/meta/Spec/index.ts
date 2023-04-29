import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { Spec } from '../../../../types'
import { ID_SPEC } from '../../../_ids'

export interface I<T> {
  unit: Unit
}

export interface O<T> {
  spec: Spec
}

export default class _Spec<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'any'],
        o: ['spec'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_SPEC
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>): void {
    const spec = unit.getSpec()

    done({
      spec,
    })
  }
}
