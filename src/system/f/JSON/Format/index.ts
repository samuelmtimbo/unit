import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_FORMAT } from '../../../_ids'

export interface I<T> {
  json: T
  space: string | number
}

export interface O {
  string: string
}

export default class Format<T> extends Functional<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['json', 'space'],
        o: ['string'],
      },
      {},
      system,
      ID_FORMAT
    )
  }

  f({ json, space }: I<T>, done): void {
    done({ string: JSON.stringify(json, null, space) })
  }
}
