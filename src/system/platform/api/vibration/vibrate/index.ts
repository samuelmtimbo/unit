import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
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

  async f({ pattern }: I, done: Done<O>, fail: Fail) {
    const {
      api: {
        device: { vibrate },
      },
    } = this.__system

    try {
      await vibrate(pattern)
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
