import { DEFAULT_STUN_RTC_CONFIG } from '../../../../../api/peer/config'
import { $$refGlobalObj } from '../../../../../async/AsyncU_'
import { Graph } from '../../../../../Class/Graph'
import { Config } from '../../../../../Class/Unit/Config'
import { $makeUnitRemoteRef } from '../../../../../client/makeUnitRemoteRef'
import { RemoteRef } from '../../../../../client/RemoteRef'
import { EXEC, INIT, TERMINATE } from '../../../../../constant/STRING'
import { G } from '../../../../../interface/G'
import { Peer } from '../../../../../Peer'
import { Primitive } from '../../../../../Primitive'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'

export interface I {
  pod: G
}

export interface O {
  id: string
}

export default class PeerSharePod extends Primitive<I, O> {
  _ = ['U']

  private _connected: boolean = false

  private _peer: Peer

  private _ref: RemoteRef

  constructor(config?: Config) {
    super(
      {
        i: ['pod', 'answer'],
        o: ['offer'],
      },
      config,
      {
        input: {
          pod: {
            ref: true,
          },
        },
      }
    )

    this.addListener('destroy', () => {
      console.log('PeerSharePod', 'destroy')
      if (this._connected) {
        this._disconnect()

        this._close()
      }
    })

    const peer = new Peer(true, DEFAULT_STUN_RTC_CONFIG)

    peer.addListener('connect', () => {
      console.log('PeerSharePod', 'connect')
      this._connected = true
      if (this._input.pod.active()) {
        this._send_init()
      }
    })

    peer.addListener('close', () => {
      console.log('PeerSharePod', 'close')
      this._connected = false
    })

    peer.addListener('message', (message: string): void => {
      console.log('PeerSharePod', 'message', message)
      if (this._ref) {
        const data = evaluate(message, globalThis.__specs)
        this._ref.exec(data)
      }
    })

    this._peer = peer
    ;(async () => {
      const offer = await peer.offer()

      this._output.offer.push(offer)
    })()
  }

  private _disconnect = () => {
    this._send_terminate()
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
    this._send({ type: TERMINATE })
  }

  onRefInputData(name: string, data: any) {
    // if (name === 'pod') {
    const pod = data as Graph

    const { globalId } = pod

    const $pod = $$refGlobalObj(globalId, ['$U', '$C', '$G'])

    const ref = $makeUnitRemoteRef($pod, ['$U', '$C', '$G'], (data) => {
      this._send_exec(data)
    })

    this._ref = ref

    if (this._connected) {
      this._send_init()
    }
    // }
  }

  onRefInputDrop(name: string) {
    // if (name === 'pod') {
    this._disconnect()
    // }
  }

  async onDataInputData(name: string, data: any) {
    if (name === 'answer') {
      await this._peer.acceptAnswer(data)
    }
  }

  async onDataOutputDrop(name: string) {
    if (name === 'answer') {
    }
  }
}
