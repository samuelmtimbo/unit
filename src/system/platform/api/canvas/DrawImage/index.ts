import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { IM } from '../../../../../types/interface/IM'
import { ID_DRAW_IMAGE } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  image: IM
  x: number
  y: number
  width: number
  height: number
  any: any
}

export interface O<T> {}

export default class DrawImage<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['canvas', 'image', 'x', 'y', 'width', 'height', 'any'],
        o: [],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
          image: {
            ref: true,
          },
        },
      },
      system,
      ID_DRAW_IMAGE
    )
  }

  async f(
    { any, canvas, image, x, y, width, height }: I<T>,
    done: Done<O<T>>
  ): Promise<void> {
    const _image = await image.image()

    await canvas.drawImage(_image, x, y, width, height)

    done()
  }
}
