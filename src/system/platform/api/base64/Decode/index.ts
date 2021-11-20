import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export type I = {
  b: string
}

export type O = {
  a: string
}

export default class Decode extends Functional<I, O> {
  constructor() {
    super({
      i: ['b'],
      o: ['a'],
    })
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
