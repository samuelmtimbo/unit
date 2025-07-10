import { Peer } from '../../../../../api/peer/Peer'
import { $ } from '../../../../../Class/$'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { MS } from '../../../../../types/interface/MS'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_PEER_TRANSMITTER } from '../../../../_ids'

export interface I {
  opt: RTCConfiguration
  close: any
  answer: string
  stream: MS
}

export interface O {
  offer: string
  channel: CH
}

export default class PeerTransmitter extends Holder<I, O> implements CH {
  private _peer: Peer = undefined

  private _unlisten: Unlisten = undefined

  private _connected: boolean = false
  private _offered: boolean = false

  private _flag_err_peer_construct: boolean = false
  private _flag_err_answer_without_offer: boolean = false

  private _unlisten_stream: Unlisten

  private _stream: MediaStream | null = null

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        i: ['answer', 'stream'],
        o: ['offer', 'channel'],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
        output: {
          channel: {
            ref: true,
          },
        },
      },
      system,
      ID_PEER_TRANSMITTER,
      'close'
    )

    this.addListener('take_err', () => {
      if (!this._backwarding) {
        if (this._flag_err_answer_without_offer) {
          this._flag_err_answer_without_offer = false
          this._backward('answer')
        } else if (this._flag_err_peer_construct) {
          this._flag_err_peer_construct = false
          this._backward('opt')
        } else {
          throw new Error('PeerTransmitter: invalid err state')
        }
      }
    })
  }

  async f({ opt }) {
    try {
      this._peer = new Peer(this.__system, true, opt)
    } catch (err) {
      const { message } = err

      const FAIL_TO_CONSTRUCT_MSG_START = `Failed to construct 'RTCPeerConnection': `

      if (message.startsWith(FAIL_TO_CONSTRUCT_MSG_START)) {
        const _err = message
          .substr(0, message.length - 1)
          .replace(FAIL_TO_CONSTRUCT_MSG_START, '')

        this.err(_err)

        return
      } else {
        this.err(err.message.toLowerCase())

        return
      }
    }

    this._unlisten = this._setup_peer()

    const offer = await this._peer.offer()

    this._offered = true

    this._output.offer.push(offer)
  }

  d() {
    if (this._connected) {
      const unlisten = this._unlisten

      unlisten()

      this._unlisten = undefined

      this._peer.close()
      this._peer = undefined

      this._connected = false
    }
  }

  async onRefInputData(name: string, unit: MS): Promise<void> {
    // if (name === 'stream') {
    const _stream = await unit.mediaStream()

    void (async () => {
      if (_stream === null) {
        if (this._stream) {
          await this._remove_stream(this._stream)
        }
        this._stream = null
      } else {
        if (this._stream) {
          await this._remove_stream(this._stream)
        }

        void this._add_stream(_stream)

        this._stream = _stream
      }
    })
    // }
  }

  async onIterDataInputData(name: keyof I, data: any): Promise<void> {
    // console.log('Transmitter', 'onIterDataInputData', name, data)

    super.onIterDataInputData(name, data)

    if (this.hasErr()) {
      this._backwarding = true

      this.takeErr()

      this._backwarding = false
    }

    if (name === 'answer') {
      const sdp = data

      if (this._offered) {
        try {
          await this._peer.acceptAnswer(sdp)
        } catch (err) {
          this.err(err.message)

          return
        }
      } else {
        this._flag_err_answer_without_offer = true

        this.err('cannot answer without offer')
      }
    }
  }

  onDataInputDrop(name: string) {
    // console.log('PeerTransmitter', 'onDataInputDrop', name)

    if (name === 'opt') {
      this._forward_all_empty()
    }
  }

  onDataOutputDrop(name: string): void {
    // console.log('PeerTransmitter', 'onDataOutputDrop', name)

    if (this._connected) {
      this._output_port()
    }
  }

  onRefInputDrop(name: string) {
    // if (name === 'stream') {
    if (this._unlisten_stream) {
      this._unlisten_stream()
      this._unlisten_stream = undefined
    }

    if (this._stream) {
      this._stream = null

      if (this._peer) {
        void this._remove_stream(this._stream)
      }
    }
    // }
  }

  private _add_stream = async (stream: MediaStream) => {
    // console.log('Peer', '_add_stream')

    this._stream = stream

    if (this._peer) {
      await this._peer.addStream(stream)
    }
  }

  private _remove_stream = async (stream: MediaStream) => {
    // console.log('Transmitter', '_remove_stream')

    await this._peer.removeStream()
  }

  private async _send_data(data: string) {
    return this._send(data)
  }

  private async _send(data: string): Promise<void> {
    this._peer.send(data)

    return
  }

  private _output_port = () => {
    // console.log('Transmitter', '_output_port')

    const peer = this._peer

    const channel = new (class Channel extends $ implements CH {
      __: string[] = ['MS']

      async send(data: string): Promise<void> {
        peer.send(data)

        return
      }
    })(this.__system)

    this._output.channel.push(channel)
  }

  private _setup_peer = (): Unlisten => {
    // console.log('Transmitter', '_setup_peer')

    const signal_listener = (signal) => {
      // console.log('Transmitter', 'signal', signal)
      const { sdp } = signal

      this._output.offer.push(sdp)
    }
    const connect_listener = () => {
      // console.log('Transmitter', 'connect')
      this._connected = true

      this._output_port()
    }
    const error_listener = (err) => {
      // console.log('Transmitter', 'error', err)

      this.err(err.message)
    }
    const close_listener = () => {
      // console.log('Transmitter', 'close')

      this._disconnect()
    }

    const message_listener = (message: string) => {
      // console.log('Transmitter', 'Peer', 'message', message)

      if (this._output.channel.active()) {
        // @ts-ignore
        this._output.channel.peak().emit('message', message)
      }
    }

    const start_listener = (stream: MediaStream) => {
      // console.log('Transmitter', 'Peer', 'start', stream)
      // const _stream = wrapMediaStream(stream, this.__system)
      // this._output.stream.push(_stream)
    }

    const stop_listener = () => {
      // console.log('Transmitter', 'Peer', 'stop')
      // this._output.stream.pull()
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

  private _disconnect = (): void => {
    if (!this._connected) {
      return
    }

    this._forward_empty('offer')
    this._forward_empty('channel')
  }

  async send(data: any): Promise<void> {
    return this._send_data(data)
  }
}
