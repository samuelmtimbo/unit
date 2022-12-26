import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_CLASS_TO_ID } from '../../../_ids'

export interface I<T> {
  Class: UnitBundle<any>
}

export interface O<T> {
  id: string
}

export default class ClassToId<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['Class'],
        o: ['id'],
      },
      {},
      system,
      ID_CLASS_TO_ID
    )
  }

  f({ Class }: I<T>, done: Done<O<T>>): void {
    const { __bundle } = Class

    const { id } = __bundle.unit

    done({ id })
  }
}
