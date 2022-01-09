import { Done } from '../../../../../../../Class/Functional/Done'
import { Graph } from '../../../../../../../Class/Graph'
import { Semifunctional } from '../../../../../../../Class/Semifunctional'
import { $$refGlobalObj } from '../../../../../../../interface/async/AsyncU_'
import { Pod } from '../../../../../../../pod'
import {
  shareLocalPod,
  stopBroadcastSource,
} from '../../../../../../../process/share/local'
import { System } from '../../../../../../../system'
import { Unlisten } from '../../../../../../../types/Unlisten'

export interface I {
  opt: {}
  graph: Graph
}

export interface O {
  id: string
}

export default class LocalSharePod extends Semifunctional<I, O> {
  __ = ['U']

  private _connected: boolean = false

  private _id: string

  private _terminate: Unlisten

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['opt', 'graph'],
        fo: ['id'],
        i: ['stop'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      if (this._connected) {
        this._disconnect()
      }
    })
  }

  private _disconnect = () => {
    if (this._connected) {
      stopBroadcastSource(this._id)
      this._terminate()
      this._connected = false
    }
  }

  f({ opt, graph }: I, done: Done<O>): void {
    const __global_id = graph.getGlobalId()

    const $graph = $$refGlobalObj(this.__system, __global_id, [
      '$U',
      '$C',
      '$G',
    ])

    const { id, terminate } = shareLocalPod($graph)

    this._id = id
    this._terminate = terminate
    this._connected = true

    done({ id })
  }

  d() {
    this._disconnect()
    this._id = undefined
  }
}
