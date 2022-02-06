import { Functional, FunctionalEvents } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  id: string
}

export interface O {}

type GamePad_EE = {}

export type GamepadEvents = FunctionalEvents<GamePad_EE> & GamePad_EE

export default class GamePad extends Functional<I, O, GamepadEvents> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id'],
        o: [],
      },
      {
        input: {
          service: {
            ref: true,
          },
        },
        output: {
          charac: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ id }, done: Done<O>): Promise<void> {
    done({})
  }

  d() {}
}
