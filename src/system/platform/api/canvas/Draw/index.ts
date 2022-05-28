import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { CA } from '../../../../../types/interface/CA'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  canvas: CA
  step: any[]
}

export interface O {
  i: number
}

export default class Draw extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  f({ canvas, step }: I, done: Done<O>): void {
    canvas.draw(step)
    done({})
  }
}
