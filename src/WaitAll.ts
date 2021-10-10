import { Functional } from './Class/Functional'
import { Done } from './Class/Functional/Done'
import { Config } from './Class/Unit/Config'

export class WaitAll<T> extends Functional<T, T> {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )
  }

  f(i: Partial<T>, done: Done<T>): void {
    done(i)
  }
}
