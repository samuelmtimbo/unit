import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { SemifunctionalEvents } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { wrapBroadcastChannel } from '../../../../../wrap/BroadcastChannel'
import { ID_BROADCAST_CHANNEL } from '../../../../_ids'

export interface I<T> {
  name: string
  message: T
}

export interface O<T> {
  channel: CH
}

export type BroadcastChannel_EE = { message: [any] }

export type BroadcastChannelEvents = SemifunctionalEvents<BroadcastChannel_EE> &
  BroadcastChannel_EE

export default class BroadcastChannel_<T> extends Holder<I<T>, O<T>> {
  private _bc: BroadcastChannel

  constructor(system: System) {
    super(
      {
        fi: ['name'],
        fo: ['channel'],
        i: [],
        o: [],
      },
      {
        output: {
          port: {
            ref: true,
          },
        },
      },
      system,
      ID_BROADCAST_CHANNEL,
      'close'
    )
  }

  f({ name }: I<T>, done: Done<O<T>>): void {
    const {
      api: {
        window: { BroadcastChannel },
      },
    } = this.__system

    this._bc = new BroadcastChannel(name)

    const channel = wrapBroadcastChannel(this._bc, this.__system)

    done({ channel })
  }

  d() {
    if (this._bc) {
      this._bc.close()
    }
  }
}
