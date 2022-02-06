import { DEFAULT_STUN_RTC_CONFIG } from '../../../../../api/peer/config'
import { Peer } from '../../../../../api/peer/Peer'
import { EXEC, INIT, TERMINATE } from '../../../../../constant/STRING'
import { asyncGraphFromPort } from '../../../../../graphFromPort'
import { $Graph } from '../../../../../interface/async/$Graph'
import { Pod } from '../../../../../pod'
import { Primitive } from '../../../../../Primitive'
import { RemotePort } from '../../../../../RemotePort'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { IPort } from '../../../../../types/global/IPort'

export interface I {
  offer: string
  opt: { iceServers: { urls: string[] }[] }
  close: any
}

export interface O {
  pod: $Graph
  answer: string
}

export default class PeerPod extends Primitive<I, O> {
  __ = ['U']

  private _peer: Peer

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt', 'offer', 'close'],
        o: ['pod', 'answer'],
      },
      {
        output: {
          pod: {
            ref: true,
          },
        },
      },
      system,
      pod
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

  private _peer_connected: boolean = false

  private _id: string

  private _target_channel: BroadcastChannel
  private _source_channel: BroadcastChannel

  private _remote_port: RemotePort

  private _offer_sent: boolean = false

  async onDataInputData(name: string, data: any): Promise<void> {
    if (name === 'opt') {
      this._peer = new Peer(
        this.__system,
        this.__pod,
        false,
        DEFAULT_STUN_RTC_CONFIG
      )

      const port: IPort = {
        send: (data) => {
          // console.log('PeerPod', 'postMessage', data)
          const message = stringify(data)
          this._peer.send(message)
        },
        onmessage(data: any) {},
        onerror() {
          console.log('onerror')
        },
        terminate() {
          console.log('terminate')
        },
      }

      this._peer.addListener('message', (message: string) => {
        // console.log('PeerPod', 'message', message)
        const specs = { ...this.__system.specs, ...this.__pod.specs }
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
              const pod = asyncGraphFromPort(
                this.__system,
                this.__pod,
                remote_port
              )
              this._output.pod.push(pod)
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
        // console.log('PeerPod', 'peer', 'connect')
        this._peer_connected = true
      })

      this._peer.addListener('close', () => {
        // console.log('PeerPod', 'peer', 'close')
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
    this._forwarding_empty = true

    if (this.hasErr()) {
      this.takeErr()
    }

    this._disconnect()

    this._forwarding_empty = false
  }

  private _disconnect = () => {
    console.log('PeerPod', '_close')
    this._backwarding = true

    this._output.pod.pull()

    if (this._remote_port) {
      this._remote_port.close()
      this._remote_port = undefined
    }

    this._backwarding = false
  }
}
