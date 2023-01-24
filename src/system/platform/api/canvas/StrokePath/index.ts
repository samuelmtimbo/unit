import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID_STROKE_PATH } from '../../../../_ids'

export interface I<T> {
  d: string
  canvas: CA
}

export interface O<T> {}

export default class StrokePath<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['d', 'canvas'],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      ID_STROKE_PATH
    )
  }

  f({ d, canvas }: I<T>, done: Done<O<T>>): void {
    canvas.strokePath(d)

    done()
  }
}
