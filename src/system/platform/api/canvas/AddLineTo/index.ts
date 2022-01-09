import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  d: any[][]
  x: number
  y: number
}

export interface O<T> {
  d: any[][]
}

export default class AddLineTo<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['d', 'x', 'y'],
        o: ['d'],
      },
      {},
      system,
      pod
    )
  }

  f({ d, x, y }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['lineTo', x, y]],
    })
  }
}
