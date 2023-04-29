import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { IB } from '../../../../../types/interface/IB'
import { ID_DRAW_IMAGE } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  bitmap: IB
  x: number
  y: number
  width: number
  height: number
}

export interface O<T> {}

export default class DrawImage<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['canvas', 'bitmap', 'x', 'y', 'width', 'height'],
        o: [],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
          bitmap: {
            ref: true,
          },
        },
      },
      system,
      ID_DRAW_IMAGE
    )
  }

  async f(
    { canvas, bitmap, x, y, width, height }: I<T>,
    done: Done<O<T>>
  ): Promise<void> {
    const imageBitmap = await bitmap.imageBitmap()

    await canvas.drawImage(imageBitmap, x, y, width, height)

    done()
  }
}
