import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'

export interface I<T> {
  Class: UnitBundle<any>
}

export interface O<T> {
  id: string
}

export default class ClassToId<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['Class'],
        o: ['id'],
      },
      {},
      system,
      pod
    )
  }

  f({ Class }: I<T>, done: Done<O<T>>): void {
    const { __bundle } = Class

    const { id } = __bundle.unit

    done({ id })
  }
}
