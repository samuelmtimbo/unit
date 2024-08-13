import { BasicHTTPRequest, BasicHTTPResponse } from '../../../../../API'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { Waiter } from '../../../../../Waiter'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_SERVER } from '../../../../_ids'

export type I = {
  port: number
  res: BasicHTTPResponse
  done: any
}

export type O = {
  req: BasicHTTPRequest
}

export default class Server extends Holder<I, O> {
  private _waiter = new Waiter<BasicHTTPResponse>()
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['port'],
        fo: [],
        i: ['res'],
        o: ['req'],
      },
      {},
      system,
      ID_SERVER
    )
  }

  async f({ port }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        http: { listen },
      },
      cache: { servers },
    } = this.__system

    try {
      this._unlisten = listen(
        port,
        async (req: BasicHTTPRequest) => {
          this._output.req.push(req)

          const res = await this._waiter.once()

          this._waiter.clear()

          return res
        },
        servers
      )
    } catch (err) {
      done(undefined, err.message)

      return
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }

  public onIterDataInputData(name: keyof I, data: any): void {
    super.onIterDataInputData(name, data)

    if (name === 'res') {
      this._waiter.set(data)

      this._input.res.pull()
    }
  }
}
