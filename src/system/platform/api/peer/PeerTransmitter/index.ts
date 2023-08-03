import { Peer } from '../../../../../api/peer/Peer'
import { $ } from '../../../../../Class/$'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { ST } from '../../../../../types/interface/ST'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_PEER_TRANSMITTER } from '../../../../_ids'

export interface I<T> {
  opt: RTCConfiguration
  close: any
  answer: string
  stream: ST
}

export interface O<T> {
  offer: string
  channel: CH
}

export default class PeerTransmitter<T>
  extends Semifunctional<I<T>, O<T>>
  implements CH
{
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
        i: ['answer', 'stream', 'close'],
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
      ID_PEER_TRANSMITTER
    )

    this.addListener('destroy', () => {
      if (this._connected) {
        this._disconnect()
      }
    })

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
        this.err(err.message)

        return
      }
    }

    this._unlisten = this._setup_peer()

    const offer = await this._peer.offer()

    this._offered = true

    this._output.offer.push(offer)
  }

  onRefInputData(name: string, unit: ST): void {
    // if (name === 'stream') {
    this._unlisten_stream = unit.stream((_stream: MediaStream) => {
      if (_stream === null) {
        if (this._stream) {
          this._remove_stream(this._stream)
        }
        this._stream = null
      } else {
        if (this._stream) {
          this._remove_stream(this._stream)
        }
        this._add_stream(_stream)
        this._stream = _stream
      }
    })
    // }
  }

  async onDataInputData(name: string, data: any): Promise<void> {
    // console.log('Transmitter', 'onDataInputData', name, data)

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
    } else if (name === 'close') {
      this._disconnect()

      this._output.offer.pull()
      this._output.channel.pull()

      this._done({})

      this._input.close.pull()
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'answer') {
      if (this._flag_err_answer_without_offer) {
        this.takeErr()
      }

      if (this._connected) {
        this._disconnect()
      }
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
        this._remove_stream(this._stream)
      }
    }
    // }
  }

  private _add_stream = (stream: MediaStream) => {
    // console.log('Peer', '_add_stream')

    this._stream = stream
    if (this._peer) {
      this._peer.addStream(stream)
    }
  }

  private _remove_stream = (stream: MediaStream) => {
    // console.log('Transmitter', '_remove_stream')

    this._peer.removeStream()
  }

  private async _send_data(data: any) {
    return this._send({ type: 'data', data })
  }

  private async _send(data: any): Promise<void> {
    const message = stringify(data)

    this._peer.send(message)

    return
  }

  private _output_port = () => {
    // console.log('Transmitter', '_output_port')

    const peer = this._peer

    const channel = new (class Channel extends $ implements CH {
      __: string[] = ['ST']

      async send(data: any): Promise<void> {
        const _data = stringify(data)

        peer.send(_data)

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

    this._peer.addListener('connect', connect_listener)
    this._peer.addListener('error', error_listener)
    this._peer.addListener('close', close_listener)

    return () => {
      this._peer.removeListener('connect', connect_listener)
      this._peer.removeListener('error', error_listener)
      this._peer.removeListener('close', close_listener)
    }
  }

  private _disconnect = (): void => {
    if (!this._connected) {
      return
    }

    const unlisten = this._unlisten

    unlisten()

    this._unlisten = undefined

    this._peer.close()
    this._peer = undefined

    this._connected = false

    this._forward_empty('offer')
    this._forward_empty('channel')

    this._done({})
  }

  async send(data: any): Promise<void> {
    return this._send_data(data)
  }
}
