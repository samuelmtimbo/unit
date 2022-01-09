import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sin(a)': number
}

export default class Sin<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['sin(a)'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'sin(a)': Math.sin(a) })
  }
}
