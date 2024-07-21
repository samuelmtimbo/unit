import { Done } from '../../../../../../../Class/Functional/Done'
import { Graph } from '../../../../../../../Class/Graph'
import { Holder } from '../../../../../../../Class/Holder'
import {
  shareLocalGraph,
  stopBroadcastSource,
} from '../../../../../../../process/share/local'
import { System } from '../../../../../../../system'
import { Unlisten } from '../../../../../../../types/Unlisten'
import { ID_LOCAL_SHARE_GRAPH } from '../../../../../../_ids'

export interface I {
  opt: {}
  graph: Graph
  done: any
}

export interface O {
  id: string
}

export default class LocalShareGraph extends Holder<I, O> {
  private _connected: boolean = false
  private _id: string

  private _terminate: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['opt', 'graph'],
        fo: ['id'],
        i: [],
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
      ID_LOCAL_SHARE_GRAPH
    )
  }

  f({ opt, graph }: I, done: Done<O>): void {
    const { id, terminate } = shareLocalGraph(graph)

    this._id = id
    this._connected = true

    this._terminate = terminate

    done({ id })
  }

  d() {
    if (this._connected) {
      stopBroadcastSource(this._id)

      this._terminate()

      this._connected = false
      this._id = undefined
    }
  }
}
