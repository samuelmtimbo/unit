import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Holder } from '../../../../Class/Holder'
import { System } from '../../../../system'
import { A } from '../../../../types/interface/A'
import { B } from '../../../../types/interface/B'
import { wrapBlob } from '../../../../wrap/Blob'
import { ID_TO_BLOB } from '../../../_ids'

export interface I<T> {
  parts: A<BlobPart> & $
  opt: BlobPropertyBag
}

export interface O<T> {
  blob: B
}

export default class Blob_<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['parts', 'opt'],
        fo: ['blob'],
        i: [],
        o: [],
      },
      {
        input: {
          parts: {
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
      ID_TO_BLOB,
      'done'
    )
  }

  async f({ parts, opt }: I<T>, done: Done<O<T>>): Promise<void> {
    let _blob: Blob

    const parts_ = await parts.raw()

    try {
      _blob = new Blob(parts_, opt)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const blob = wrapBlob(_blob, this.__system)

    done({
      blob,
    })
  }
}
