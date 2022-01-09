import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sign(a)': number
}

export default class Sign<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['sign(a)'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'sign(a)': Math.sign(a) })
  }
}
