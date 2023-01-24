import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID_FILL_PATH } from '../../../../_ids'

export interface I<T> {
  d: string
  canvas: CA
  rule: 'evenodd' | 'nonzero'
}

export interface O<T> {}

export default class FillPath<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['d', 'canvas', 'rule'],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      ID_FILL_PATH
    )
  }

  f({ d, canvas, rule }: I<T>, done: Done<O<T>>): void {
    canvas.fillPath(d, rule)

    done()
  }
}
