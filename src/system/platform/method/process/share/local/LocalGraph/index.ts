import { AsyncWorkerGraph } from '../../../../../../../AsyncWorker'
import { $ } from '../../../../../../../Class/$'
import { Functional } from '../../../../../../../Class/Functional'
import { Done } from '../../../../../../../Class/Functional/Done'
import {
  CONNECT,
  DISCONNECT,
  EXEC,
  TERMINATE,
} from '../../../../../../../constant/STRING'
import {
  hasLocalBroadcastSource,
  localBroadcastSourceName,
  localBroadcastTargetName,
  startBroadcastTarget,
  stopBroadcastTarget,
} from '../../../../../../../process/share/local'
import { RemotePort } from '../../../../../../../RemotePort'
import { System } from '../../../../../../../system'
import { Port } from '../../../../../../../types/global/Port'
import { $Graph } from '../../../../../../../types/interface/async/$Graph'
import { $wrap } from '../../../../../../../wrap'
import { ID_LOCAL_GRAPH } from '../../../../../../_ids'

export interface I {
  id: string
}

export interface O {
  graph: $Graph & $
}

export default class LocalGraph extends Functional<I, O> {
  __ = ['U']

  constructor(system: System) {
    super(
      {
        i: ['id'],
        o: ['graph'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_LOCAL_GRAPH
    )
  }

  private _connected: boolean = false

  private _id: string

  private _target_channel: BroadcastChannel
  private _source_channel: BroadcastChannel

  private _remote_port: RemotePort

  f({ id: source_id }: I, done: Done<O>): void {
    if (!hasLocalBroadcastSource(source_id)) {
      this.err('cannot find local graph')

      return
    }

    this._connected = true

    const { id, channel } = startBroadcastTarget()

    this._id = id
    this._target_channel = channel

    const name = localBroadcastTargetName(id)

    const source_channel_name = localBroadcastSourceName(source_id)
    const source_channel = new BroadcastChannel(source_channel_name)
    this._source_channel = source_channel

    source_channel.postMessage({ type: CONNECT, data: name })

    const port: Port = {
      send: (data) => {
        channel.postMessage(data)
      },
      onmessage(data: any) {},
      onerror() {
        // console.log('onerror')
      },
      terminate() {
        // console.log('terminate')
      },
    }

    channel.onmessage = (event: MessageEvent) => {
      const { data } = event

      const { type, data: _data } = data

      switch (type) {
        case EXEC:
          {
            port.onmessage({ data: _data })
          }
          break
        case TERMINATE:
          {
            this._close()
          }
          break
      }
    }

    const remote_port = new RemotePort(port)
    this._remote_port = remote_port

    const $graph: $Graph = AsyncWorkerGraph(remote_port)

    const graph = $wrap<$Graph>(this.__system, $graph, ['U', 'C', 'G'])

    done({ graph })
  }

  d() {
    if (this._connected) {
      this._source_channel.postMessage({ type: DISCONNECT, data: this._id })
    }

    this._close()
  }

  private _close = () => {
    if (this._connected) {
      this._remote_port.close()
      this._target_channel.close()

      stopBroadcastTarget(this._id)

      this._id = undefined
      this._target_channel = undefined
    }
  }
}
