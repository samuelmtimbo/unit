import { DEFAULT_STUN_RTC_CONFIG } from '../../../../../api/peer/config'
import { Peer } from '../../../../../api/peer/Peer'
import { Graph } from '../../../../../Class/Graph'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { $makeUnitRemoteRef } from '../../../../../client/makeUnitRemoteRef'
import { RemoteRef } from '../../../../../client/RemoteRef'
import { EXEC, INIT, TERMINATE } from '../../../../../constant/STRING'
import { $$refGlobalObj } from '../../../../../interface/async/AsyncU_'
import { Pod } from '../../../../../pod'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'

export interface I {
  pod: Graph
  answer: string
}

export interface O {
  offer: string
}

export default class PeerSharePod extends Semifunctional<I, O> {
  __ = ['U']

  private _connected: boolean = false
  private _peer: Peer
  private _ref: RemoteRef

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['pod'],
        fo: [],
        i: ['answer'],
        o: ['offer'],
      },
      {
        input: {
          pod: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      console.log('PeerSharePod', 'destroy')
      if (this._connected) {
        this._disconnect()

        this._close()
      }
    })

    const peer = new Peer(
      this.__system,
      this.__pod,
      true,
      DEFAULT_STUN_RTC_CONFIG
    )

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
        const specs = { ...this.__system.specs, ...this.__pod.specs }
        const classes = this.__system.classes

        const data = evaluate(message, specs, classes)

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

  f({ pod }: I) {
    const { __global_id } = pod

    const $pod = $$refGlobalObj(this.__system, __global_id, ['$U', '$C', '$G'])

    const ref = $makeUnitRemoteRef($pod, ['$U', '$C', '$G'], (data) => {
      this._send_exec(data)
    })

    this._ref = ref

    if (this._connected) {
      this._send_init()
    }
  }

  d() {
    this._disconnect()
  }

  public async onIterDataInputData(name: string, data: any): Promise<void> {
    // if (name === 'answer') {
    await this._peer.acceptAnswer(data)
    // }
  }

  public async onIterDataInputDrop(name: string): Promise<void> {}
}
