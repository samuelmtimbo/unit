import { Pod } from '../pod'
import { System } from '../system'
import { Functional } from './Functional'
import { Done } from './Functional/Done'

export class WaitAll<T = any> extends Functional<T, T> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  f(i: Partial<T>, done: Done<T>): void {
    done(i)
  }
}
