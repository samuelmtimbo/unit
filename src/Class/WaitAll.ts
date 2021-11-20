import { System } from '../system'
import { Functional } from './Functional'
import { Done } from './Functional/Done'

export class WaitAll<T> extends Functional<T, T> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system
    )
  }

  f(i: Partial<T>, done: Done<T>): void {
    done(i)
  }
}
