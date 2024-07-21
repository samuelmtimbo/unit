import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID } from '../../../../../types/interface/ID'
import { J } from '../../../../../types/interface/J'
import { wrapImageData } from '../../../../../wrap/ImageData'
import { ID_GET_IMAGE_DATA } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  x: number
  y: number
  width: number
  height: number
  opt: {}
  done: any
  any: any
}

export interface O<T> {
  image: J & ID
}

export default class GetImageData<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['canvas', 'x', 'y', 'width', 'height', 'opt', 'any'],
        fo: ['image'],
      },
      {
        input: {
          canvas: {
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
      ID_GET_IMAGE_DATA
    )
  }

  async f(
    { canvas, x, y, width, height, opt }: I<T>,
    done: Done<O<T>>
  ): Promise<void> {
    let imageData: ImageData

    try {
      imageData = await canvas.getImageData(x, y, width, height, opt)
    } catch (err) {
      if (err instanceof RangeError) {
        done(undefined, 'out of memory')

        return
      }

      done(undefined, err.message)

      return
    }

    const image = wrapImageData(imageData, this.__system)

    done({
      image,
    })
  }
}
