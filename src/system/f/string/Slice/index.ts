import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import slice from './f'

export interface I<T> {
  a: string
  begin: number
  end: number
}

export interface O<T> {
  a: string
}

export default class Slice<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'begin', 'end'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f(i: I<T>, done): void {
    done(slice(i))
  }
}
