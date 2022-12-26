import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_STRINGIFY } from '../../../_ids'

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
      ID_STRINGIFY
    )
  }

  f({ json }: I<T>, done): void {
    done({ string: JSON.stringify(json) })
  }
}
