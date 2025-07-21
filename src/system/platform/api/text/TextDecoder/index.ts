import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { TD } from '../../../../../types/interface/TD'
import { wrapTextDecoder } from '../../../../../wrap/TextDecoder'
import { ID_TEXT_DECODER } from '../../../../_ids'

export interface I {
  label: string
  opt: TextDecoderOptions
}

export interface O {
  decoder: TD & $
}

export default class TextDecoder_ extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['label', 'opt'],
        fo: ['decoder'],
        i: [],
        o: [],
      },
      {
        output: {
          decoder: {
            ref: true,
          },
        },
      },
      system,
      ID_TEXT_DECODER
    )
  }

  f({ label, opt }: I, done: Done<O>, fail: Fail) {
    const {
      api: {
        text: { TextDecoder },
      },
    } = this.__system

    let decoder_: TextDecoder

    try {
      decoder_ = new TextDecoder(label, opt)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const decoder = wrapTextDecoder(decoder_, this.__system)

    done({
      decoder,
    })
  }
}
