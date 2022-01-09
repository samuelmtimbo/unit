import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  pattern: number[]
}

export type O = {}

export default class Vibrate extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['pattern'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  f({ pattern }: I, done: Done<O>) {
    const {
      api: {
        device: { vibrate },
      },
    } = this.__system

    try {
      vibrate(pattern)
    } catch (err) {
      done(undefined, err.message)
      return
    }

    done({})
  }
}
