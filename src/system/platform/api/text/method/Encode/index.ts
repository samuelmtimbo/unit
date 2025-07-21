import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { TA } from '../../../../../../types/interface/TA'
import { TE } from '../../../../../../types/interface/TE'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_ENCODE_0 } from '../../../../../_ids'

export interface I {
  opt: object
  text: string
  encoder: TE
}

export interface O {
  data: TA
}

export default class Encode extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['opt', 'text', 'encoder'],
        fo: ['data'],
        i: [],
        o: [],
      },
      {
        input: {
          encoder: {
            ref: true,
          },
        },
        output: {
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_ENCODE_0
    )
  }

  async f({ opt, text, encoder }: I, done: Done<O>, fail: Fail) {
    let data_: Uint8Array

    try {
      data_ = encoder.encode(opt, text)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const data = wrapUint8Array(data_, this.__system)

    done({
      data,
    })
  }
}
