import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { BO } from '../../../../../types/interface/BO'
import { wrapArrayBuffer } from '../../../../../wrap/ArrayBuffer'
import { ID_TO_BLOB } from '../../../../_ids'

export type I = {
  body: BO & $
  any: any
  done: any
}

export type O = {
  buffer: AB & $
  done: any
}

export default class ToArrayBuffer extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['body', 'any'],
        fo: ['buffer'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          body: {
            ref: true,
          },
        },
        output: {
          buffer: {
            ref: true,
          },
        },
      },
      system,
      ID_TO_BLOB
    )
  }

  async f({ body }: I, done: Done<O>, fail: Fail) {
    let arrayBuffer_: ArrayBuffer

    try {
      arrayBuffer_ = await body.arrayBuffer()
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const buffer = wrapArrayBuffer(arrayBuffer_, this.__system)

    done({ buffer })
  }

  b() {
    this._output.done.push(true)
  }
}
