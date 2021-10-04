import { Config } from '../../../../../../../Class/Unit/Config'
import {
  CONNECT,
  DISCONNECT,
  EXEC,
  TERMINATE,
} from '../../../../../../../constant/STRING'
import { graphFromPort } from '../../../../../../../graphFromPort'
import { G } from '../../../../../../../interface/G'
import { Primitive } from '../../../../../../../Primitive'
import {
  hasLocalBroadcastSource,
  localBroadcastSourceName,
  localBroadcastTargetName,
  startBroadcastTarget,
  stopBroadcastTarget,
} from '../../../../../../../process/share/local'
import { RemotePort } from '../../../../../../../RemotePort'
import { Port } from './../../../../../../../Port'

export interface I {
  id: string
}

export interface O {
  graph: G
}

export default class LocalPod extends Primitive<I, O> {
  _ = ['U']

  constructor(config?: Config) {
    super(
      {
        i: ['id'],
        o: ['pod'],
      },
      config,
      {
        output: {
          graph: {
            ref: true,
          },
        },
      }
    )

    this.addListener('destroy', () => {
      this.__forward_empty()
    })

    this.addListener('take_err', () => {
      this._input.id.pull()
    })

    this.addListener('take_caught_err', () => {
      this._input.id.pull()
    })
  }

  private _connected: boolean = false

  private _id: string

  private _target_channel: BroadcastChannel
  private _source_channel: BroadcastChannel

  private _remote_port: RemotePort

  onDataInputData(_: string, data: any): void {
    // if (_ === 'id') {
    const source_id = data

    if (!hasLocalBroadcastSource(source_id)) {
      this.err('cannot find local pod')
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
        console.log('onerror')
      },
      terminate() {
        console.log('terminate')
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

    const graph = graphFromPort(remote_port)

    this._output.pod.push(graph)
    // }
  }

  private __forward_empty = () => {
    this._forwarding_empty = true

    if (this.hasErr()) {
      this.takeErr()
    }

    if (this._connected) {
      this._source_channel.postMessage({ type: DISCONNECT, data: this._id })
    }

    this._close()

    this._forwarding_empty = false
  }

  private _close = () => {
    this._backwarding = true

    if (this._connected) {
      this._remote_port.close()
      this._target_channel.close()
      stopBroadcastTarget(this._id)
      this._id = undefined
      this._target_channel = undefined
    }

    this._output.pod.pull()
    this._input.id.pull()

    this._backwarding = false
  }

  onDataInputDrop(name: string): void {
    // if (name === 'id') {
    if (!this._backwarding) {
      this.__forward_empty()
    }
    // }
  }
}
