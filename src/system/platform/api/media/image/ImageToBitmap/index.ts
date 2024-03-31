import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Rect } from '../../../../../../client/util/geometry/types'
import { System } from '../../../../../../system'
import { IB } from '../../../../../../types/interface/IB'
import { IM } from '../../../../../../types/interface/IM'
import { wrapImageBitmap } from '../../../../../../wrap/ImageBitmap'
import { ID_IMAGE_TO_BITMAP } from '../../../../../_ids'

export type I = {
  image: IM
  opt: {}
  rect:
    | Rect
    | Omit<Rect, 'x' | 'y'>
    | Omit<Rect, 'x' | 'y' | 'width' | 'height'>
}

export type O = {
  bitmap: IB
}

export default class ImageToBitmap extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['opt', 'image', 'rect'],
        o: ['bitmap'],
      },
      {
        input: {
          image: {
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
      ID_IMAGE_TO_BITMAP
    )
  }

  async f({ opt, rect, image }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        media: {
          image: { createImageBitmap },
        },
      },
    } = this.__system

    const _image = await image.image()

    let _bitmap: ImageBitmap

    try {
      _bitmap = await createImageBitmap(_image, rect, opt)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const bitmap = wrapImageBitmap(_bitmap, this.__system)

    done({
      bitmap,
    })
  }
}
