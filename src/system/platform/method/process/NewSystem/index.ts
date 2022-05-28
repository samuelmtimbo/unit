import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { S } from '../../../../../types/interface/S'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  init: {}
  done: any
}

export interface O {
  system: S
}

export default class NewSystem extends Semifunctional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['init'],
        fo: ['system'],
        i: ['done'],
        o: []
      },
      {
        output: {
          system: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ init }: I, done: Done<O>): void {}
}
