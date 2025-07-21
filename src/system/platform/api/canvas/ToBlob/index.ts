import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { CA } from '../../../../../types/interface/CA'
import { wrapBlob } from '../../../../../wrap/Blob'
import { ID_TO_BLOB } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  quality: number
  type: string
  done: any
}

export interface O<T> {
  blob: B
  done: any
}

export default class ToBlob<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['canvas', 'quality', 'type'],
        fo: ['blob'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          canvas: {
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

  async f(
    { canvas, quality, type }: I<T>,
    done: Done<O<T>>,
    fail: Fail
  ): Promise<void> {
    let _blob: Blob

    try {
      _blob = await canvas.toBlob(type, quality)
    } catch (err) {
      fail(err.message)

      return
    }

    const blob = wrapBlob(_blob, this.__system)

    done({
      blob,
    })
  }

  b() {
    this._output.done.push(true)
  }
}
