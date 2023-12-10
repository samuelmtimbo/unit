import { System } from '../system'
import { Functional } from './Functional'
import { Done } from './Functional/Done'

const ID_WAIT_ALL = '_5d09d860-a8fe-428b-befd-7c793bc0783c'

export class WaitAll<T = any> extends Functional<T, T> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_WAIT_ALL
    )

    this.play()
  }

  f(i: Partial<T>, done: Done<T>): void {
    done(i)
  }
}
