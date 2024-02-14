import { Peer } from '../../../../../api/peer/Peer'
import { AsyncWorkerGraph } from '../../../../../AsyncWorker'
import { $ } from '../../../../../Class/$'
import { EXEC, INIT, TERMINATE } from '../../../../../constant/STRING'
import { Primitive } from '../../../../../Primitive'
import { RemotePort } from '../../../../../RemotePort'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { Port } from '../../../../../types/global/Port'
import { $Graph } from '../../../../../types/interface/async/$Graph'
import { $wrap } from '../../../../../wrap'
import { ID_PEER_GRAPH } from '../../../../_ids'

export interface I {
  offer: string
  opt: { iceServers: { urls: string[] }[] }
  close: any
}

export interface O {
  graph: $Graph & $
  answer: string
}

export default class PeerGraph extends Primitive<I, O> {
  __ = ['U']

  private _peer: Peer
  private _peer_connected: boolean = false
  private _id: string
  private _target_channel: BroadcastChannel
  private _source_channel: BroadcastChannel
  private _remote_port: RemotePort
  private _offer_sent: boolean = false

  constructor(system: System) {
    super(
      {
        i: ['opt', 'offer', 'close'],
        o: ['graph', 'answer'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_PEER_GRAPH
    )

    this.addListener('destroy', () => {
      this.__forward_empty()
    })

    this.addListener('take_err', () => {
      //
    })

    this.addListener('take_caught_err', () => {
      //
    })
  }

  async onDataInputData(name: string, data: any): Promise<void> {
    // console.log('PeerGraph', 'onDataInputData', name, data)

    if (name === 'opt') {
      this._peer = new Peer(this.__system, false, data)

      const port: Port = {
        send: (data) => {
          // console.log('PeerGraph', 'postMessage', data)
          const message = stringify(data)
          this._peer.send(message)
        },
        onmessage(data: any) {},
        onerror() {
          // console.log('onerror')
        },
        terminate() {
          // console.log('terminate')
        },
      }

      this._peer.addListener('message', (message: string) => {
        // console.log('PeerGraph', 'message', message)

        const specs = this.__system.specs
        const classes = this.__system.classes

        const data = evaluate(message, specs, classes)

        const { type, data: _data } = data

        switch (type) {
          case EXEC:
            {
              port.onmessage({ data: _data })
            }
            break
          case INIT:
            {
              const remote_port = new RemotePort(port)

              this._remote_port = remote_port

              const $graph: $Graph = AsyncWorkerGraph(remote_port)

              const graph = $wrap<$Graph>(this.__system, $graph, [
                'U',
                'C',
                'G',
              ])

              this._output.graph.push(graph)
            }
            break
          case TERMINATE:
            {
              this._disconnect()
            }
            break
        }
      })

      this._peer.addListener('connect', () => {
        // console.log('PeerGraph', 'peer', 'connect')
        this._peer_connected = true
      })

      this._peer.addListener('close', () => {
        // console.log('PeerGraph', 'peer', 'close')
        this._peer_connected = false
      })

      const offer = this._input.offer.peak()
      if (offer !== undefined) {
        this._accept_offer(offer)
      }
    } else if (name === 'offer') {
      if (this._peer) {
        const offer = data
        this._accept_offer(offer)
      }
    } else if (name === 'close') {
      this.__forward_empty()
    }
  }

  onDataInputDrop(name: string): void {
    if (name === 'opt') {
      if (!this._backwarding) {
        this.__forward_empty()
      }
    }
  }

  private _accept_offer = async (offer: string): Promise<void> => {
    await this._peer.acceptOffer(offer)

    const answer = await this._peer.answer()

    this._output.answer.push(answer)

    this._offer_sent = true
  }

  private __forward_empty = () => {
    this._forward_all_empty()

    this._backward('offer')
    this._backward('close')
    this._backward('opt')

    this._forwarding_empty = true

    if (this.hasErr()) {
      this.takeErr()
    }

    this._disconnect()

    this._forwarding_empty = false
  }

  private _disconnect = () => {
    // console.log('PeerGraph', '_close')

    this._backwarding = true

    this._output.graph.pull()

    if (this._remote_port) {
      this._remote_port.close()
      this._remote_port = undefined
    }

    if (this._peer) {
      // this._peer.close()
      this._peer = null
    }

    this._backwarding = false
  }
}
