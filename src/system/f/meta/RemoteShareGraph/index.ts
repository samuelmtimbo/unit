import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { Holder } from '../../../../Class/Holder'
import { makeUnitRemoteRef } from '../../../../client/makeUnitRemoteRef'
import { RemoteRef } from '../../../../client/RemoteRef'
import { System } from '../../../../system'
import { UCGEE } from '../../../../types/interface/UCGEE'
import { ID_REMOTE_SHARE_GRAPH } from '../../../_ids'

export interface I {
  graph: Graph
  message: string
  opt: {}
}

export interface O {
  message: string
}

export default class RemoteShareGraph extends Holder<I, O> {
  __ = ['U']

  private _ref: RemoteRef

  constructor(system: System) {
    super(
      {
        fi: ['graph', 'opt'],
        fo: [],
        i: ['message'],
        o: ['message'],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_REMOTE_SHARE_GRAPH
    )
  }

  private _disconnect = () => {}

  private _close = () => {
    this._ref = null
  }

  private _send = (data) => {
    this._output.message.push(data)
  }

  f({ graph, opt }: I, done: Done<O>) {
    const ref = makeUnitRemoteRef(graph, UCGEE, (data) => {
      this._send(data)
    })

    this._ref = ref

    if (this._input.message.active()) {
      this._ref.exec(this._input.message.peak())

      this._input.message.pull()
    }
  }

  d() {
    this._disconnect()
    this._close()
  }

  public async onIterDataInputData(name: string, data: any): Promise<void> {
    if (name === 'message') {
      if (this._ref) {
        this._ref.exec(data)

        this._input.message.pull()
      }
    }
  }
}
