import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { IB } from '../../../../../types/interface/IB'

export interface I<T> {
  canvas: CA
  bitmap: IB
}

export interface O<T> {
  d: any[][]
}

export default class DrawImage<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['canvas', 'bitmap', 'any'],
        o: [],
      },
      {
        input: {
          canvas: {
            ref: true
          },
          bitmap: {
            ref: true
          }
        }
      },
      system,
      pod
    )
  }

  async f({ canvas, bitmap }: I<T>, done: Done<O<T>>): Promise<void> {
    const imageBitmap = await bitmap.imageBitmap()

    await canvas.drawImage(imageBitmap)

    done()
  }
}
