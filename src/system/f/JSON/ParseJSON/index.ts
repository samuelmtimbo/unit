import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_PARSE_JSON } from '../../../_ids'

export interface I {
  string: string
}

export interface O {
  json: object
}

export default class ParseJSON extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['string'],
        o: ['json'],
      },
      {},
      system,
      ID_PARSE_JSON
    )
  }

  f({ string }: I, done: Done<O>): void {
    let json

    try {
      json = JSON.parse(string)
    } catch (err) {
      done(undefined, 'invalid JSON')

      return
    }

    done({ json })
  }
}
