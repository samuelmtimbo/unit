import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { fromId } from '../../../../spec/fromId'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'

export interface I<T> {
  id: string
}

export interface O<T> {
  Class: UnitBundle<any>
}

export default class IdToClass<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id'],
        o: ['Class'],
      },
      {},
      system,
      pod
    )
  }

  f({ id }: I<T>, done: Done<O<T>>): void {
    const Class = fromId(
      id,
      { ...this.__system.specs, ...this.__pod.specs },
      this.__system.classes
    )
    done({ Class })
  }
}
