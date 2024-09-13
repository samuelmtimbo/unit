import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
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

  async f({ image }: I, done: Done<O>): Promise<void> {
    const image_ = await image.image()

    const image__ = wrapImage(image_, this.__system)

    done({
      image: image__,
    })
  }
}
