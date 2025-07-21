import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { BO } from '../../../../../types/interface/BO'
import { wrapBlob } from '../../../../../wrap/Blob'
import { ID_TO_BLOB } from '../../../../_ids'

export type I = {
  body: BO & $
  any: any
  done: any
}

export type O = {
  blob: B & $
  done: any
}

export default class ToBlob extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['body', 'any'],
        fo: ['blob'],
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
          blob: {
            ref: true,
          },
        },
      },
      system,
      ID_TO_BLOB
    )
  }

  async f({ body }: I, done: Done<O>, fail: Fail) {
    let blob_: Blob

    try {
      blob_ = await body.blob()
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const blob = wrapBlob(blob_, this.__system)

    done({ blob })
  }

  b() {
    this._output.done.push(true)
  }
}
