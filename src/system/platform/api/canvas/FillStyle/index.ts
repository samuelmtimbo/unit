import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  d: any[][]
  fillStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class FillStyle<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['fillStyle', 'd'],
        o: ['d'],
      },
      {},
      system,
      pod
    )
  }

  f({ d, fillStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['fillStyle', fillStyle]],
    })
  }
}
