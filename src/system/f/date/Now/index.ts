import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  any: T
}

export interface O<T> {
  now: number
}

export default class Now<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['now'],
      },
      {},
      system,
      pod
    )
  }

  f({ any }: Partial<I<T>>, done): void {
    done({ now: new Date().getTime() })
  }
}
