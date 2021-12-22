import { DEFAULT_STUN_RTC_CONFIG } from '../../../../../api/peer/config'
import { Callback } from '../../../../../Callback'
import { $ } from '../../../../../Class/$'
import { $ST } from '../../../../../interface/async/$ST'
import { ST } from '../../../../../interface/ST'
import NOOP from '../../../../../NOOP'
import { Peer } from '../../../../../Peer'
import { Primitive } from '../../../../../Primitive'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { Unlisten } from '../../../../../Unlisten'

export interface I<T> {
  offer: string
}

export interface O<T> {
  stream: $ST
}

export default class PeerReceiver<T> extends Primitive<I<T>, O<T>> {
  private _peer: Peer | null = null

  private _unlisten: Unlisten | undefined = undefined

  private _connected: boolean = false

  private _flag_err_invalid_offer: boolean = false

  constructor() {
    super(
      {
        i: ['offer', 'close'],
        o: ['answer', 'stream'],
      },
      {
        input: {},
      }
    )

    this.addListener('destroy', () => {
      this._disconnect()
    })

    this.addListener('take_err', () => {
      if (this._flag_err_invalid_offer) {
        this._flag_err_invalid_offer = false
        this._backward('offer')
      } else {
        // TODO
      }
    })

    this._peer = new Peer(false, DEFAULT_STUN_RTC_CONFIG)

    this._setup_peer()
  }

  async onDataInputData(name: string, data: any): Promise<void> {
    // console.log('Receiver', 'onDataInputData', name, data)
    // TODO
    if (this.hasErr()) {
      this._backwarding = true
      this.takeErr()
      this._backwarding = false
    }
    if (name === 'offer') {
      try {
        await this._peer.acceptOffer(data)
      } catch (err) {
        this._flag_err_invalid_offer = true
        this.err('invalid offer')
        return
      }
      const answer = await this._peer.answer()
      this._output.answer.push(answer)
    } else if (name === 'close') {
      this._disconnect()
    }
  }

  onDataInputDrop(name: string): void {
    // console.log('Receiver', 'onDataInputDrop', name, data)
    if (name === 'opt') {
      if (!this._backwarding) {
        this._disconnect()
      }
    } else if (name === 'offer') {
      if (this._flag_err_invalid_offer) {
        this._flag_err_invalid_offer = false
        this.takeErr()
        return
      }
    }
  }

  onDataOutputDrop(name: string): void {
    if (name === 'answer') {
      this._input.offer.pull()
    }
  }

  private _send_data = (data: any, callback: Callback) => {
    this._send({ type: 'data', data }, callback)
  }

  private _send = (data: any, callback: Callback): void => {
    if (this._connected) {
      const message = stringify(data)
      this._peer.send(message)
      callback()
    } else {
      callback(undefined, 'peer not connected')
    }
  }

  private _setup_peer = (): Unlisten => {
    const signal_listener = (signal) => {
      console.log('Receiver', 'signal', signal)
      const { sdp } = signal
      this._output.answer.push(sdp)
    }
    const connect_listener = () => {
      console.log('Receiver', 'Peer', 'connect')
      this._connected = true
    }
    const error_listener = (err) => {
      console.log('Receiver', 'Peer', 'error', err)
      this.err(err.message)
    }
    const close_listener = () => {
      console.log('Receiver', 'Peer', 'close')
      this._disconnect()
    }
    const message_listener = (message: string) => {
      const data = evaluate(message)
      console.log('Receiver', 'Peer', 'data', data)
      this.emit('message', data)
    }
    const start_listener = (stream: MediaStream) => {
      console.log('Receiver', 'Peer', 'start', stream)
      const _stream = new (class Stream extends $ implements ST {
        __: string[] = ['ST']

        stream(callback: Callback<MediaStream>): Unlisten {
          callback(stream)
          return NOOP
        }
      })()
      this._output.stream.push(_stream)
    }
    const stop_listener = () => {
      console.log('Receiver', 'Peer', 'stop')
      this._output.stream.pull()
    }

    this._peer.addListener('signal', signal_listener)
    this._peer.addListener('connect', connect_listener)
    this._peer.addListener('error', error_listener)
    this._peer.addListener('close', close_listener)
    this._peer.addListener('message', message_listener)
    this._peer.addListener('start', start_listener)
    this._peer.addListener('stop', stop_listener)

    return () => {
      this._peer.removeListener('signal', signal_listener)
      this._peer.removeListener('connect', connect_listener)
      this._peer.removeListener('error', error_listener)
      this._peer.removeListener('close', close_listener)
      this._peer.removeListener('message', message_listener)
      this._peer.removeListener('start', start_listener)
      this._peer.removeListener('stop', stop_listener)
    }
  }

  private _disconnect = (): void => {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._peer) {
      this._peer.destroy()
      this._peer = null
    }

    this._connected = false
  }

  $send({ data }: { data: any }, callback: Callback<void>): void {
    this._send_data(data, callback)
  }
}
