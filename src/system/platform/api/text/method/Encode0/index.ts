import { $ } from '../../../../../../Class/$'
import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { AB } from '../../../../../../types/interface/AB'
import { TA } from '../../../../../../types/interface/TA'
import { TE } from '../../../../../../types/interface/TE'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_ENCODE_1 } from '../../../../../_ids'

export interface I {
  opt: object
  text: AB & $
  encoder: TE
}

export interface O {
  data: TA
}

export default class Encode0 extends Holder<I, O> {
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
      ID_ENCODE_1
    )
  }

  async f({ opt, text, encoder }: I, done: Done<O>) {
    let data_: Uint8Array

    try {
      const text_ = text.raw() as Uint8Array

      data_ = encoder.encode(opt, text_)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    const data = wrapUint8Array(data_, this.__system)

    done({
      data,
    })
  }
}
