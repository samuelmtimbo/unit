import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { RES } from '../../../../../types/interface/RES'
import { ID_TO_JSON } from '../../../../_ids'

export type I = {
  res: RES & $
  any: any
}

export type O = {
  json: any
}

export default class ToJson extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['res', 'any'],
        o: ['json'],
      },
      {},
      system,
      ID_TO_JSON
    )
  }

  async f({ res }: I, done: Done<O>): Promise<void> {
    let json: any

    try {
      json = await res.toJson()
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({ json })
  }
}
