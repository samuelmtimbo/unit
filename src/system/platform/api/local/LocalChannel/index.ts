import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import {
  Semifunctional,
  SemifunctionalEvents,
} from '../../../../../Class/Semifunctional'
import { CH } from '../../../../../interface/CH'
import { RE } from '../../../../../interface/RE'
import { Pod } from '../../../../../pod'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { IChannel } from '../../../../../types/global/IChannel'
import { Unlisten } from '../../../../../types/Unlisten'

export interface I<T> {
  channel: string
  message: T
}

export interface O<T> {
  port: CH
}

export type LocalChannel_EE = { message: [any] }

export type LocalChannelEvents = SemifunctionalEvents<LocalChannel_EE> &
  LocalChannel_EE

export default class LocalChannel<T>
  extends Semifunctional<I<T>, O<T>>
  implements RE
{
  private _bc: IChannel | null = null

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['channel'],
        fo: ['port'],
        i: ['close'],
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
      pod
    )
  }

  f({ channel }: I<T>, done: Done<O<T>>): void {
    const {
      api: {
        channel: { local },
      },
    } = this.__system

    this._bc = local({ channel })
    const bc = this._bc

    const port = new (class Port extends $<LocalChannelEvents> implements CH {
      private _unlisten: Unlisten

      constructor(system: System, pod: Pod) {
        super(system, pod)

        this._unlisten = bc.addListener('message', (event: MessageEvent) => {
          const { specs, classes } = this.__system

          const { data } = event

          const _data = evaluate(data, specs, classes)

          this.emit('message', _data)
        })

        this.addListener('destroy', () => {
          this._unlisten()
          this._unlisten = undefined
        })
      }

      __: string[] = ['P']

      send(data: any): Promise<void> {
        const _data = stringify(data)

        bc.postMessage(_data)

        return
      }
    })(this.__system, this.__pod)

    done({ port })
  }

  d() {
    if (this._bc) {
      this._bc.close()
    }
  }
}
