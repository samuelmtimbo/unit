import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { System } from '../../../../../../system'
import { $BC } from '../../../../../../types/interface/async/$BC'
import { Async } from '../../../../../../types/interface/async/Async'
import { ID_WRITE_VALUE } from '../../../../../_ids'

export interface I {
  charac: $BC
  value: string
}

export interface O {}

export default class WriteValue extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['charac', 'value'],
        o: [],
      },
      {
        input: {
          charac: {
            ref: true,
          },
        },
      },
      system,
      ID_WRITE_VALUE
    )
  }

  async f({ charac, value }: I, done: Done<O>, fail: Fail): Promise<void> {
    charac = Async(charac, ['BC'], this.__system.async)

    try {
      charac.$writeValue({ value }, (_, err) => {
        if (err) {
          fail(err)

          return
        }

        done({})
      })
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }
  }
}
