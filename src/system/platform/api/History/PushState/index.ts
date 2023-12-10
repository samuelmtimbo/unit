import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_PUSH_STATE } from '../../../../_ids'

export type I = {
  data: any
  title: string
  url: string
}

export type O = {}

export default class PushState extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['data', 'title', 'url'],
        o: [],
      },
      {},
      system,
      ID_PUSH_STATE
    )
  }

  async f({ data, title, url }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        history: { pushState },
      },
    } = this.__system

    pushState(data, title, url)

    done()
  }
}
