import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { System } from '../../../../../../system'
import { BSN } from '../../../../../../types/interface/BSN'
import { ID_START } from '../../../../../_ids'

export type I = {
  node: BSN & $
  opt: { start?: number; offset?: number; duration?: number }
}

export type O = {}

export default class Start0 extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['node', 'opt'],
        o: [],
      },
      {
        input: {
          node: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      ID_START
    )
  }

  async f({ node, opt }: I, done: Done<O>, fail: Fail): Promise<void> {
    try {
      const { start = 0, offset = undefined, duration = undefined } = opt

      node.start(start, offset, duration)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({})
  }
}
