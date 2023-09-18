import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { CH } from '../../../../types/interface/CH'
import { ID_SEND } from '../../../_ids'

interface I<T> {
  channel: CH
  data: any
}

interface O<T> {}

export default class Send<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['channel', 'data'],
        o: [],
      },
      {
        input: {
          channel: {
            ref: true,
          },
        },
      },
      system,
      ID_SEND
    )
  }

  async f({ channel, data }: I<T>, done: Done<O<T>>) {
    try {
      let _data = data

      if (_data instanceof $) {
        _data = await _data.raw()
      }

      await channel.send(_data)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
