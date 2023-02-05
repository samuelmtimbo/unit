import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_ALERT } from '../../../../_ids'

export type I = {
  message: string
}

export type O = {}

export default class Alert extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['message'],
        o: [],
      },
      {},
      system,
      ID_ALERT
    )
  }

  f({ message }: I, done: Done<O>): void {
    const {
      api: {
        alert: { alert },
      },
    } = this.__system

    alert(message)

    done()
  }
}
