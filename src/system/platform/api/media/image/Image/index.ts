import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { IM } from '../../../../../../types/interface/IM'
import { wrapImage } from '../../../../../../wrap/Image'
import { ID_IMAGE } from '../../../../../_ids'

export type I = {
  src: string
}

export type O = {
  image: IM
}

export default class Image0 extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['src'],
        o: ['image'],
      },
      {
        output: {
          image: {
            ref: true,
          },
        },
      },
      system,
      ID_IMAGE
    )
  }

  async f({ src }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        window: { Image },
      },
    } = this.__system

    const image_ = new Image()

    image_.src = src

    const image = wrapImage(image_, this.__system)

    image_.onload = () => {
      done({
        image,
      })
    }
  }
}
