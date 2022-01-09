import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: number
}

export interface O<T> {
  random: number
}

export default class Random<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['random'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I<T>, done): void {
    done({ random: Math.random() })
  }
}
