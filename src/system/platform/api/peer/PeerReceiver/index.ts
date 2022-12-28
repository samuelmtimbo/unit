import { Peer } from '../../../../../api/peer/Peer'
import { FunctionalEvents } from '../../../../../Class/Functional'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { ST } from '../../../../../types/interface/ST'
import { Unlisten } from '../../../../../types/Unlisten'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'
import { ID_PEER_RECEIVER } from '../../../../_ids'

export interface I<T> {
  offer: string
  close: any
  opt: RTCConfiguration
}

export interface O<T> {
  stream: ST
  answer: string
}

export type PeerReceiver_EE = { message: [any] }

export type PeerReceiverEvents = FunctionalEvents<PeerReceiver_EE> &
  PeerReceiver_EE

export default class PeerReceiver<T> extends Semifunctional<
  I<T>,
  O<T>,
  PeerReceiverEvents
> {
  private _peer: Peer | null = null

  private _unlisten: Unlisten | undefined = undefined

  private _connected: boolean = false

  private _flag_err_invalid_offer: boolean = false

  constructor(system: System) {
    super(
      {
        fi: ['offer', 'opt'],
        fo: ['answer'],
        i: ['close'],
        o: ['stream'],
      },
      {
        input: {},
      },
      system,
      ID_PEER_RECEIVER
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
  }

  async f({ offer, opt }: I<T>) {
    this._peer = new Peer(this.__system, false, opt)

    try {
      await this._peer.acceptOffer(offer)
    } catch (err) {
      this._flag_err_invalid_offer = true

      this.err('invalid offer')

      return
    }

    const answer = await this._peer.answer()

    this._output.answer.push(answer)

    this._setup_peer()
  }

  async onDataInputData(name: string, data: any): Promise<void> {
    // console.log('Receiver', 'onDataInputData', name, data)

    if (name === 'close') {
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
      const specs = this.__system.specs
      const classes = this.__system.classes
      const data = evaluate(message, specs, classes)
      console.log('Receiver', 'Peer', 'data', data)
      this.emit('message', data)
    }
    const start_listener = (stream: MediaStream) => {
      console.log('Receiver', 'Peer', 'start', stream)
      const _stream = wrapMediaStream(stream, this.__system)
      this._output.stream.push(_stream)
    }
    const stop_listener = () => {
      console.log('Receiver', 'Peer', 'stop')
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
