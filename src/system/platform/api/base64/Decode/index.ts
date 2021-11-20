import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export type I = {
  b: string
}

export type O = {
  a: string
}

export default class Decode extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['b'],
        o: ['a'],
      },
      config
    )
  }

  f({ b }: I, done: Done<O>): void {
    let a

    try {
      a = atob(b)
    } catch {
      done(undefined, 'string not correctly enconded')
      return
    }

    done({ a })
  }
}
