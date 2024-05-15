import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID_SCALE } from '../../../../_ids'

export interface I<T> {
  sx: number
  sy: number
  canvas: CA
}

export interface O<T> {}

export default class Scale<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['sx', 'sy', 'canvas'],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      ID_SCALE
    )
  }

  f({ canvas, sx, sy }: I<T>, done: Done<O<T>>): void {
    canvas.scale(sx, sy)

    done()
  }
}
