import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { WP } from '../../../../../types/interface/WP'
import { ID_POST_MESSAGE } from '../../../../_ids'

export interface I {
  window: WP
  target: string
  data: any
}

export interface O {}

export default class PostMessage extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['window', 'target', 'data'],
        o: [],
      },
      {
        output: {
          window: {
            ref: true,
          },
        },
      },
      system,
      ID_POST_MESSAGE
    )
  }

  f({ window, target, data }: I, done: Done<O>) {
    const {
      api: {
        window: { open },
      },
    } = this.__system

    done({})
  }
}
