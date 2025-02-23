import { Peer } from '../../../../../api/peer/Peer'
import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { MS } from '../../../../../types/interface/MS'
import { Unlisten } from '../../../../../types/Unlisten'
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
  channel: CH
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
        o: ['stream', 'channel', 'answer'],
      },
      {
        input: {},
        output: {
          channel: {
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

  async f({ opt }: I, done: Done<O>) {
    try {
      this._peer = new Peer(this.__system, false, opt)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

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

  async onDataInputDrop<K extends keyof I | 'done'>(name: K, data: any) {
    if (name === 'opt') {
      this._forward_all_empty()
    }
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

      this._forward_empty('channel')
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

      const peer = this._peer

      const channel = new (class Channel extends $ implements CH {
        __: string[] = ['CH']

        async send(data: string): Promise<void> {
          peer.send(data)

          return
        }
      })(this.__system)

      this._output.channel.push(channel)
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

      if (this._output.channel.active()) {
        // @ts-ignore
        this._output.channel.peak().emit('message', message)
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
