import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_PARSE } from '../../../_ids'

export interface I {
  string: string
}

export interface O {
  json: object
}

export default class Parse extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['string'],
        o: ['json'],
      },
      {},
      system,
      ID_PARSE
    )
  }

  f({ string }: I, done: Done<O>): void {
    try {
      const json = JSON.parse(string)
      done({ json })
    } catch (err) {
      done(undefined, 'invalid JSON')
    }
  }
}
