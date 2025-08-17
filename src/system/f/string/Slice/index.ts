import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_SLICE } from '../../../_ids'
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
  constructor(system: System) {
    super(
      {
        i: ['a', 'begin', 'end'],
        o: ['a'],
      },
      {},
      system,
      ID_SLICE
    )
  }

  f(i: I<T>, done: Done<O<T>>): void {
    done(slice(i))
  }
}
