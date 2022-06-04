import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Rect } from '../../../../../../client/util/geometry'
import { B } from '../../../../../../types/interface/B'
import { IB } from '../../../../../../types/interface/IB'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'

export type I = {
  blob: B
  opt: {}
  rect:
    | Rect
    | Omit<Rect, 'x' | 'y'>
    | Omit<Rect, 'x' | 'y' | 'width' | 'height'>
}

export type O = {
  bitmap: IB
}

export default class BlobToBitmap extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt', 'blob', 'rect'],
        o: ['bitmap'],
      },
      {
        input: {
          blob: {
            ref: true,
          },
        },
        output: {
          bitmap: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ opt, rect, blob }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        media: {
          image: { createImageBitmap },
        },
      },
    } = this.__system

    const _blob = await blob.blob()

    let _bitmap: ImageBitmap

    try {
      _bitmap = await createImageBitmap(_blob, rect, opt)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const bitmap = new (class Bitmap extends $ implements IB {
      __: string[] = ['IB']

      async imageBitmap(): Promise<ImageBitmap> {
        return _bitmap
      }
    })(this.__system, this.__pod)

    done({
      bitmap,
    })
  }
}
