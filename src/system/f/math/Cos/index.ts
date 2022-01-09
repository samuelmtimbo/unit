import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: number
}

export interface O<T> {
  'cos(a)': number
}

export default class Cos<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['cos(a)'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'cos(a)': Math.cos(a) })
  }
}
