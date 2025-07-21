import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { TE } from '../../../../../types/interface/TE'
import { wrapTextEncoder } from '../../../../../wrap/TextEncoder'
import { ID_TEXT_ENCODER } from '../../../../_ids'

export interface I {
  opt: TextEncoderCommon
}

export interface O {
  encoder: TE & $
}

export default class TextEncoder_ extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['encoder'],
      },
      {
        output: {
          encoder: {
            ref: true,
          },
        },
      },
      system,
      ID_TEXT_ENCODER
    )
  }

  f({ opt }: I, done: Done<O>, fail: Fail) {
    const {
      api: {
        text: { TextEncoder },
      },
    } = this.__system

    let encoder_: TextEncoder

    try {
      encoder_ = new TextEncoder()
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const encoder = wrapTextEncoder(encoder_, this.__system)

    done({
      encoder,
    })
  }
}
