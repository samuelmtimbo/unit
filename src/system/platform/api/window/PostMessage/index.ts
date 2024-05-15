import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { WP } from '../../../../../types/interface/WP'
import { ID_POST_MESSAGE } from '../../../../_ids'

export interface I {
  window: WP
  target: string
  data: any
}

export interface O {}

export default class PostMessage extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['window', 'target', 'data'],
        fo: [],
        i: [],
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
