import {
  ServerHandler,
  ServerRequest,
  ServerResponse,
} from '../../../../../API'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { Waiter } from '../../../../../Waiter'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { SE } from '../../../../../types/interface/SE'
import { uuid } from '../../../../../util/id'
import { ID_LISTEN_0 } from '../../../../_ids'

export type I = {
  port: number
  server: SE
  close: any
}

export type O = {
  url: string
}

export const makeHandler = (
  system: System,
  push: (url: string) => void
): ServerHandler => {
  const {
    cache: { requests, responses },
  } = system

  return async (req: ServerRequest) => {
    let url: string

    do {
      url = `${uuid()}`
    } while (requests[url])

    const waiter = new Waiter<ServerResponse>()

    requests[url] = req
    responses[url] = waiter

    push(url)

    const response = await waiter.once()

    delete requests[url]
    delete responses[url]

    return response
  }
}

export default class Listen0 extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['server', 'port'],
        fo: [],
        i: [],
        o: ['url'],
      },
      {
        input: {
          server: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      ID_LISTEN_0,
      'close'
    )
  }

  async f({ server, port }: I, done: Done<O>, fail: Fail): Promise<void> {
    if (port < 1 || port > 65535) {
      fail('invalid out-of-range port')

      return
    }

    const handler = makeHandler(this.__system, (url) => {
      this._output.url.push(url)
    })

    try {
      this._unlisten = server.listen(port, handler, (err) => {
        fail(err)
      })
    } catch (err) {
      fail(err.message)
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
