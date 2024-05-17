import { BasicHTTPRequest, BasicHTTPResponse } from '../../../../../API'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
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

export default class Server extends Semifunctional<I, O> {
  private _waiter = new Waiter<BasicHTTPResponse>()
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['port'],
        fo: [],
        i: ['res', 'done'],
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
    } = this.__system

    try {
      this._unlisten = listen(port, async (req: BasicHTTPRequest) => {
        this._output.req.push(req)

        const res = await this._waiter.once()

        this._waiter.clear()

        return res
      })
    } catch (err) {
      done(undefined, err.message)

      return
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    switch (name) {
      case 'res':
        {
          this._waiter.set(data)

          this._input.res.pull()
        }
        break
      case 'done':
        {
          if (this._unlisten) {
            this._unlisten()

            this._done()
          }

          this._input.done.pull()
        }
        break
    }
  }
}
