import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID_DRAW } from '../../../../_ids'

export interface I {
  canvas: CA
  step: any[]
}

export interface O {
  i: number
}

export default class Draw extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['canvas', 'step'],
        o: [],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      ID_DRAW
    )
  }

  async f({ canvas, step }: I, done: Done<O>): Promise<void> {
    await canvas.draw(step)

    done()
  }
}
