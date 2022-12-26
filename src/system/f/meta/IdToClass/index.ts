import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { fromId } from '../../../../spec/fromId'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_ID_TO_CLASS } from '../../../_ids'

export interface I<T> {
  id: string
}

export interface O<T> {
  Class: UnitBundle<any>
}

export default class IdToClass<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id'],
        o: ['Class'],
      },
      {},
      system,
      ID_ID_TO_CLASS
    )
  }

  f({ id }: I<T>, done: Done<O<T>>): void {
    const Class = fromId(id, this.__system.specs, this.__system.classes)
    done({ Class })
  }
}
