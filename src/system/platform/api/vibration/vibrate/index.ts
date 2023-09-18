import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_VIBRATE } from '../../../../_ids'

export type I = {
  pattern: number[]
}

export type O = {}

export default class Vibrate extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['pattern'],
        o: [],
      },
      {},
      system,
      ID_VIBRATE
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

    done()
  }
}
