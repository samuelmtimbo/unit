import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export type I = {
  pattern: number[]
}

export type O = {}

export default class Vibrate extends Functional<I, O> {
  constructor() {
    super({
      i: ['pattern'],
      o: [],
    })
  }

  f({ pattern }: I, done: Done<O>) {
    if (navigator && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
    done({})
  }
}
