import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  any: any
}

export interface O<T> {
  pi: number
}

export default class PI<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['PI'],
      },
      {},
      system,
      pod
    )
  }

  f({ any }: I<T>, done): void {
    done({ PI: Math.PI })
  }
}
