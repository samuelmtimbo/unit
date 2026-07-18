import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { System } from '../../../../../../system'
import { IM } from '../../../../../../types/interface/IM'
import { wrapImage } from '../../../../../../wrap/Image'
import { ID_IMAGE_0 } from '../../../../../_ids'

export type I = {
  image: IM
}

export type O = {
  image: IM
}

export default class Image1 extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['image'],
        o: ['image'],
      },
      {
        input: {
          image: {
            ref: true,
          },
        },
        output: {
          image: {
            ref: true,
          },
        },
      },
      system,
      ID_IMAGE_0
    )
  }

  async f({ image }: I, done: Done<O>, fail: Fail): Promise<void> {
    const image_ = await image.image()

    if (!(image_ instanceof HTMLImageElement)) {
      fail('unsupported image type')

      return
    }

    const image__ = wrapImage(image_, this.__system)

    done({
      image: image__,
    })
  }
}
