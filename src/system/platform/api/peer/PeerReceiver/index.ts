import { Peer } from '../../../../../api/peer/Peer'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { EE } from '../../../../../types/interface/EE'
import { MS } from '../../../../../types/interface/MS'
import { Unlisten } from '../../../../../types/Unlisten'
import { wrapEventEmitter } from '../../../../../wrap/EventEmitter'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'
import { ID_PEER_RECEIVER } from '../../../../_ids'

export interface I {
  offer: string
  close: any
  opt: RTCConfiguration
}

export interface O {
  stream: MS
  answer: string
  emitter: EE<any>
}

export default class PeerReceiver extends Holder<I, O> {
  private _peer: Peer | null = null

  private _unlisten: Unlisten | undefined = undefined

  private _connected: boolean = false

  private _flag_err_invalid_offer: boolean = false

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: [],
        i: ['offer'],
        o: ['stream', 'emitter', 'answer'],
      },
      {
        input: {},
        output: {
          emitter: {
            ref: true,
          },
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_PEER_RECEIVER,
      'close'
    )

    this.addListener('take_err', () => {
      if (this._flag_err_invalid_offer) {
        this._flag_err_invalid_offer = false

        this._backward('offer')
      } else {
        // TODO
      }
    })
  }

  async f({ opt }: I) {
    this._peer = new Peer(this.__system, false, opt)

    this._setup_peer()

    if (this._input.offer.active()) {
      this._output_answer(this._input.offer.peak())
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._peer) {
      this._peer.close()
      this._peer = null
    }

    this._connected = false
  }

  private _output_answer = async (offer: string) => {
    try {
      await this._peer.acceptOffer(offer)
    } catch (err) {
      this._flag_err_invalid_offer = true

      this.err('invalid offer')

      return
    }

    const answer = await this._peer.answer()

    this._output.answer.push(answer)
  }

  async onIterDataInputData(name: keyof I, data: any): Promise<void> {
    super.onIterDataInputData(name, data)

    if (name === 'offer') {
      if (this._input.opt.active()) {
        this._output_answer(data)
      }
    }
  }

  onIterDataInputDrop(name: keyof I | 'done'): void {
    super.onIterDataInputDrop(name)

    if (name === 'offer') {
      if (this._flag_err_invalid_offer) {
        this._flag_err_invalid_offer = false
        this.takeErr()
        return
      }
      this._forward_empty('emitter')
      this._forward_empty('stream')
      this._forward_empty('answer')
    }
  }

  onDataOutputDrop(name: string): void {
    if (name === 'answer') {
      this._input.offer.pull()
    }
  }

  private _setup_peer = (): Unlisten => {
    const connect_listener = () => {
      // console.log('Receiver', 'Peer', 'connect')

      this._connected = true

      const emitter = wrapEventEmitter(this.__system)

      this._output.emitter.push(emitter)
    }

    const error_listener = (err) => {
      // console.log('Receiver', 'Peer', 'error', err)

      this.err(err.message)
    }

    const close_listener = () => {
      // console.log('Receiver', 'Peer', 'close')

      this.d()
    }

    const message_listener = (message: string) => {
      // console.log('Receiver', 'Peer', 'message', message)

      if (this._output.emitter.active()) {
        // @ts-ignore
        this._output.emitter.peak().emit('message', message)
      }
    }

    const start_listener = (stream: MediaStream) => {
      // console.log('Receiver', 'Peer', 'start', stream)

      const _stream = wrapMediaStream(stream, this.__system)

      this._output.stream.push(_stream)
    }

    const stop_listener = () => {
      // console.log('Receiver', 'Peer', 'stop')

      this._output.stream.pull()
    }

    this._peer.addListener('connect', connect_listener)
    this._peer.addListener('error', error_listener)
    this._peer.addListener('close', close_listener)
    this._peer.addListener('message', message_listener)
    this._peer.addListener('start', start_listener)
    this._peer.addListener('stop', stop_listener)

    return () => {
      this._peer.removeListener('connect', connect_listener)
      this._peer.removeListener('error', error_listener)
      this._peer.removeListener('close', close_listener)
      this._peer.removeListener('message', message_listener)
      this._peer.removeListener('start', start_listener)
      this._peer.removeListener('stop', stop_listener)
    }
  }
}
