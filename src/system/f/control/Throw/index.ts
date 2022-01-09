import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  message: string
}

export default class Throw extends Functional<I, {}> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['message'],
      },
      {},
      system,
      pod
    )
  }

  f({ message }: I, done: Done<{}>): void {
    done(undefined, message)
  }
}
