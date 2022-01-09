import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { uuid } from '../../../../util/id'

export interface I<T> {
  any: T
}

export interface O<T> {
  uuid: T
}

export default class UUID<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['uuid'],
      },
      {},
      system,
      pod
    )
  }

  f({ any }: Partial<I<T>>, done): void {
    done({ uuid: uuid() })
  }
}
