import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { System } from '../../../../../../system'
import { AB } from '../../../../../../types/interface/AB'
import { TD } from '../../../../../../types/interface/TD'
import { ID_DECODE_0 } from '../../../../../_ids'

export interface I {
  opt: TextDecodeOptions
  decoder: TD & $
  data: AB & $
}

export interface O {
  text: string
}

export default class Decode extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['opt', 'data', 'decoder'],
        o: ['text'],
      },
      {
        input: {
          data: {
            ref: true,
          },
          decoder: {
            ref: true,
          },
        },
      },
      system,
      ID_DECODE_0
    )
  }

  async f({ opt, decoder, data }: I, done: Done<O>, fail: Fail) {
    let text: string

    const data_ = (await data.raw()) as ArrayBuffer

    try {
      text = decoder.decode(opt, data_)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({ text })
  }
}
