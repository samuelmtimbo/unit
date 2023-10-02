import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { IB } from '../../../../../types/interface/IB'
import { IBRC } from '../../../../../types/interface/IBCA'
import { ID_TRANSFER_FROM_IMAGE_BITMAP } from '../../../../_ids'

export interface I<T> {
  canvas: IBRC
  bitmap: IB
  init: any
}

export interface O<T> {}

export default class TransferFromImageBitmap<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['canvas', 'bitmap', 'init'],
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
      ID_TRANSFER_FROM_IMAGE_BITMAP
    )
  }

  async f({ canvas, bitmap, init }: I<T>, done: Done<O<T>>): Promise<void> {
    const imageBitmap = await bitmap.imageBitmap()

    await canvas.transferFromImageBitmap(imageBitmap)

    done()
  }
}
