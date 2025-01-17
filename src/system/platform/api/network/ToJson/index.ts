import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { BO } from '../../../../../types/interface/BO'
import { ID_TO_JSON } from '../../../../_ids'

export type I = {
  body: BO & $
  any: any
}

export type O = {
  json: any
}

export default class ToJson extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['body', 'any'],
        o: ['json'],
      },
      {},
      system,
      ID_TO_JSON
    )
  }

  async f({ body }: I, done: Done<O>): Promise<void> {
    let json: any

    try {
      json = await body.json()
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({ json })
  }
}
