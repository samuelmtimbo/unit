import { Server } from '../../../../../API'
import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { SE } from '../../../../../types/interface/SE'
import { wrapHTTPServer } from '../../../../../wrap/Server'
import { ID_CREATE_SERVER } from '../../../../_ids'

export type I = {
  opt: object
  close: any
}

export type O = {
  server: SE & $
}

export default class CreateServer extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['server'],
        i: [],
        o: [],
      },
      {},
      system,
      ID_CREATE_SERVER,
      'close'
    )
  }

  async f({ opt }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        http: { createServer },
      },
      cache: { servers },
    } = this.__system

    let _server: Server

    try {
      _server = createServer(opt, servers)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    const server = wrapHTTPServer(_server, this.__system)

    done({
      server,
    })
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
