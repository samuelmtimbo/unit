import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { System } from '../../../../../../system'
import { $BC } from '../../../../../../types/interface/async/$BC'
import { Async } from '../../../../../../types/interface/async/Async'
import { ID_READ_VALUE } from '../../../../../_ids'

export interface I {
  charac: $BC
  any: any
}

export interface O {
  value: string
}

export default class ReadValue extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['charac', 'any'],
        o: ['value'],
      },
      {
        input: {
          charac: {
            ref: true,
          },
        },
      },
      system,
      ID_READ_VALUE
    )
  }

  async f({ charac }: I, done: Done<O>, fail: Fail): Promise<void> {
    charac = Async(charac, ['BC'], this.__system.async)

    try {
      charac.$readValue({}, (value, err) => {
        if (err) {
          fail(err)

          return
        }

        done({ value })
      })
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }
  }
}
