import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
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

export default class ToBlob<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['canvas', 'quality', 'type'],
        fo: ['blob'],
        i: ['done'],
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

    const blob = new (class _Blob extends $ implements B {
      __: string[] = ['MS']

      async blob(): Promise<Blob> {
        try {
          _blob = await canvas.toBlob(type, quality)
        } catch (err) {
          done(undefined, err.message)

          return
        }

        return _blob
      }
    })(this.__system)

    done({
      blob,
    })
  }

  onIterDataInputData(name: string) {
    // if (name === 'done') {
    this._forward_empty('blob')

    this._backward('done')
    // }
  }
}
