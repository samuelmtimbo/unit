import { Functional } from '../../../../Class/Functional'
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

  f({ json }: I<T>, done): void {
    let string: string

    try {
      string = JSON.stringify(json)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({ string })
  }
}
