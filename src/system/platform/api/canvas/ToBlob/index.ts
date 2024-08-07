import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { CA } from '../../../../../types/interface/CA'
import { ID_TO_BLOB } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  quality: number
  type: string
  done: any
}

export interface O<T> {
  blob: B
}

export default class ToBlob<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['canvas', 'quality', 'type'],
        fo: ['blob'],
        i: [],
        o: [],
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

  async f({ canvas, quality, type }: I<T>, done: Done<O<T>>): Promise<void> {
    let _blob: Blob

    try {
      _blob = await canvas.toBlob(type, quality)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const blob = new (class _Blob extends $ implements B {
      __: string[] = ['B', 'IM', 'BO']

      async image(): Promise<any> {
        return _blob
      }

      async blob(): Promise<Blob> {
        return _blob
      }

      async raw() {
        return _blob
      }
    })(this.__system)

    done({
      blob,
    })
  }
}
