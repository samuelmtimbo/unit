import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  d: any[][]
}

export interface O<T> {
  d: any[][]
}

export default class DrawImage<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['d'],
        o: ['d'],
      },
      {},
      system,
      pod
    )
  }

  f({ d }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['clear']],
    })
  }
}
