import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_STRINGIFY_0 } from '../../../_ids'

export interface I<T> {
  json: T
}

export interface O {
  string: string
}

export default class Stringify<T> extends Functional<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['json'],
        o: ['string'],
      },
      {},
      system,
      ID_STRINGIFY_0
    )
  }

  f({ json }: I<T>, done: Done<O>, fail: Fail): void {
    let string: string

    try {
      string = JSON.stringify(json)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({ string })
  }
}
