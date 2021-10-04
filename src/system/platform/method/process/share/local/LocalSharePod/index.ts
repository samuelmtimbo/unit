import { $$refGlobalObj } from '../../../../../../../async/AsyncU_'
import { Graph } from '../../../../../../../Class/Graph'
import { Config } from '../../../../../../../Class/Unit/Config'
import { G } from '../../../../../../../interface/G'
import { Primitive } from '../../../../../../../Primitive'
import {
  shareLocalPod,
  stopBroadcastSource,
} from '../../../../../../../process/share/local'
import { Unlisten } from '../../../../../../../Unlisten'

export interface I {
  graph: G
}

export interface O {
  id: string
}

export default class LocalSharePod extends Primitive<I, O> {
  _ = ['U']

  private _connected: boolean = false

  private _id: string

  private _terminate: Unlisten

  constructor(config?: Config) {
    super(
      {
        i: ['graph'],
        o: ['id'],
      },
      config,
      {
        input: {
          graph: {
            ref: true,
          },
        },
      }
    )

    this.addListener('destroy', () => {
      if (this._connected) {
        this._disconnect()
      }
    })
  }

  private _disconnect = () => {
    stopBroadcastSource(this._id)
    this._terminate()
    this._connected = false
  }

  onRefInputData(name: string, data: any) {
    // if (name === 'graph') {
    const graph = data as Graph
    const { globalId } = graph
    const $graph = $$refGlobalObj(globalId, ['$U', '$C', '$G'])
    const { id, terminate } = shareLocalPod($graph)
    this._id = id
    this._terminate = terminate
    this._connected = true
    this._output.id.push(id)
    // }
  }

  onRefInputDrop(name: string) {
    // if (name === 'graph') {
    this._disconnect()
    this._id = undefined
    this._output.id.pull()
    // }
  }

  onDataOutputDrop(name: string) {
    // if (name === 'id') {
    if (this._id) {
      this._output.id.push(this._id)
    }
    // }
  }
}
