import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export type I = {
  pattern: number[]
}

export type O = {}

export default class Vibrate extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['pattern'],
        o: [],
      },
      config
    )
  }

  f({ pattern }: I, done: Done<O>) {
    if (navigator && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
    done({})
  }
}
