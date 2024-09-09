import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { RES } from '../../../../../types/interface/RES'
import { wrapBlob } from '../../../../../wrap/Blob'
import { ID_TO_BLOB_0 } from '../../../../_ids'

export type I = {
  res: RES & $
  any: any
  done: any
}

export type O = {
  blob: B & $
}

export default class ToBlob extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['res', 'any'],
        fo: ['blob'],
        i: [],
        o: [],
      },
      {
        input: {
          res: {
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
      ID_TO_BLOB_0
    )
  }

  async f({ res }: I, done: Done<O>) {
    let blob_: Blob

    try {
      blob_ = await res.toBlob()
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    const blob = wrapBlob(blob_, this.__system)

    done({ blob })
  }
}
