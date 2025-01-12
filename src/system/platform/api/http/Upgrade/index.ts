import { ServerSocket } from '../../../../../API'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { S } from '../../../../../types/interface/S'
import { wrapServerSocket } from '../../../../../wrap/ServerSocket'
import { ID_UPGRADE } from '../../../../_ids'

export type I = {
  server: S
  url: any
  accept: boolean
}

export type O = {}

export default class Upgrade extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['url'],
        fo: ['socket'],
        i: [],
        o: [],
      },
      {
        input: {},
        output: {
          socket: {
            ref: true,
          },
        },
      },
      system,
      ID_UPGRADE,
      'close'
    )
  }

  async f({ url }: I, done: Done<O>): Promise<void> {
    const {
      cache: { requests, responses, ws, wss },
      api: {
        http: { handleUpgrade },
      },
    } = this.__system

    const _request = requests[url]
    const _response = responses[url]

    if (!_request) {
      done(undefined, 'request not found')

      return
    }

    let _socket: ServerSocket

    try {
      _socket = await handleUpgrade(
        _request,
        _response,
        ws,
        wss,
      )
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const socket = wrapServerSocket(_socket, this.__system)

    done({ socket })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }

  public onIterDataInputData(name: keyof I, data: any): void {
    super.onIterDataInputData(name, data)
  }
}
