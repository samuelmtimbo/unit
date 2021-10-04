import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import subtract from './f'

export interface I {
  a: number
  b: number
}

export interface O {
  'a - b': number
}

export default class Subtract extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a - b'],
      },
      config
    )
  }

  f(i: I, done: Done<O>): void {
    done(subtract(i))
  }
}
