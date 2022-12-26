import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { CA } from '../../../../../types/interface/CA'
import { ID_TO_BLOB } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  quality: number
  type: string
}

export interface O<T> {
  blob: B
}

export default class ToBlob<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['canvas', 'quality', 'type'],
        o: ['blob'],
      },
      {
        input: {
          canvas: {
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
      __: string[] = ['ST']

      async blob(): Promise<Blob> {
        console.log('_Blob', 'read', _blob)
        return _blob
      }
    })(this.__system)

    done({
      blob,
    })
  }
}
