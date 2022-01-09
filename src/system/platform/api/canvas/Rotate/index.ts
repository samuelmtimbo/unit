import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  d: any[][]
  rad: number
}

export interface O<T> {
  d: any[][]
}

export default class Rotate<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['d', 'rad'],
        o: ['d'],
      },
      {},
      system,
      pod
    )
  }

  f({ d, rad }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['rotate', rad]],
    })
  }
}
