import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_LOCATION } from '../../../../_ids'

export type I = {
  any: any
}

export type O = {
  url: string
}

export default class Location extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['url'],
      },
      {},
      system,
      ID_LOCATION
    )
  }

  async f({ any }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        location: { toString },
      },
    } = this.__system

    const url = await toString()

    done({ url })
  }
}
