import { Peer } from '../../../../../api/peer/Peer'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { makeUnitRemoteRef } from '../../../../../client/makeUnitRemoteRef'
import { RemoteRef } from '../../../../../client/RemoteRef'
import { EXEC, INIT, TERMINATE } from '../../../../../constant/STRING'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { ID_PEER_SHARE_GRAPH } from '../../../../_ids'

export interface I {
  graph: Graph
  answer: string
  opt: RTCConfiguration
}

export interface O {
  offer: string
}

export default class PeerShareGraph extends Semifunctional<I, O> {
  __ = ['U']

  private _connected: boolean = false
  private _peer: Peer
  private _ref: RemoteRef

  constructor(system: System) {
    super(
      {
        fi: ['graph', 'opt'],
        fo: ['offer'],
        i: ['answer', 'close'],
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
      ID_PEER_SHARE_GRAPH
    )

    this.addListener('destroy', () => {
      // console.log('PeerShareGraph', 'destroy')

      if (this._connected) {
        this._disconnect()
        this._close()
      }
    })
  }

  private _disconnect = () => {
    this._send_terminate()

    this._peer = null
  }

  private _close = () => {
    this._ref = null
  }

  private _send = (data) => {
    const message = stringify(data)
    this._peer.send(message)
  }

  private _send_init = () => {
    this._send({ type: INIT })
  }

  private _send_exec = (data: any) => {
    this._send({ type: EXEC, data })
  }

  private _send_terminate = () => {
    if (this._connected) {
      this._send({ type: TERMINATE })
    }
  }

  f({ graph, opt }: I, done: Done<O>) {
    const peer = new Peer(this.__system, true, opt)

    this._connected = false

    peer.addListener('connect', () => {
      console.log('PeerShareGraph', 'connect')
      this._connected = true

      if (this._input.graph.active()) {
        this._send_init()
      }
    })

    peer.addListener('close', () => {
      console.log('PeerShareGraph', 'close')
      this._connected = false
    })

    peer.addListener('message', (message: string): void => {
      console.log('PeerShareGraph', 'message', message)
      if (this._ref) {
        const specs = this.__system.specs
        const classes = this.__system.classes

        const data = evaluate(message, specs, classes)

        this._ref.exec(data)
      }
    })

    this._peer = peer
    ;(async () => {
      const offer = await peer.offer()

      done({
        offer,
      })
    })()

    const ref = makeUnitRemoteRef(graph, ['U', 'C', 'G'], (data) => {
      this._send_exec(data)
    })

    this._ref = ref

    if (this._connected) {
      this._send_init()
    }

    if (this._input.answer.active()) {
      ;(async () => {
        await this._peer.acceptAnswer(this._input.answer.peak())
      })()
    }
  }

  d() {
    this._disconnect()
  }

  public async onIterDataInputData(name: string, data: any): Promise<void> {
    if (name === 'answer') {
      if (this._peer) {
        await this._peer.acceptAnswer(data)
      }
    } else if (name === 'close') {
      this._disconnect()
    }
  }

  public async onIterDataInputDrop(name: string): Promise<void> {
    if (name === 'answer') {
      this._disconnect()
    }
  }
}
