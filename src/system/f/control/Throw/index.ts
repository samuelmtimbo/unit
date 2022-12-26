import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_THROW } from '../../../_ids'

export interface I {
  message: string
}

export default class Throw extends Functional<I, {}> {
  constructor(system: System) {
    super(
      {
        i: ['message'],
      },
      {},
      system,
      ID_THROW
    )
  }

  f({ message }: I, done: Done<{}>): void {
    done(undefined, message)
  }
}
