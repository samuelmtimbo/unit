import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { uuid } from '../../../../util/id'
import { ID_UUID } from '../../../_ids'

export interface I<T> {
  any: T
}

export interface O<T> {
  uuid: string
}

export default class UUID<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['uuid'],
      },
      {},
      system,
      ID_UUID
    )
  }

  f({ any }: Partial<I<T>>, done: Done<O<T>>): void {
    done({ uuid: uuid() })
  }
}
