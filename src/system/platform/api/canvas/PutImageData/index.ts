import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID } from '../../../../../types/interface/ID'
import { ID_PUT_IMAGE_DATA } from '../../../../_ids'

export interface I<T> {
  any: any
  canvas: CA
  image: ID
  dx: number
  dy: number
  x: number
  y: number
  width: number
  height: number
}

export interface O<T> {
  done: true
}

export default class PutImageData<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['any', 'canvas', 'image', 'dx', 'dy', 'x', 'y', 'width', 'height'],
        fo: ['done'],
        i: [],
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
        output: {},
      },
      system,
      ID_PUT_IMAGE_DATA
    )
  }

  async f(
    { canvas, image, dx, dy, x, y, width, height }: I<T>,
    done: Done<O<T>>
  ): Promise<void> {
    const imageData = image.imageData()

    await canvas.putImageData(imageData, dx, dy, x, y, width, height)

    done({
      done: true,
    })
  }
}
