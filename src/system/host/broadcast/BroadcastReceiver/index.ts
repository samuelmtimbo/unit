import { Peer } from '../../../../api/peer/Peer'
import { sendServerPeer } from '../../../../api/server/peer'
import { buildIOTurnConfig } from '../../../../api/server/peer/config'
import { newPeerReceiverId } from '../../../../api/server/peer/id'
import { $ } from '../../../../Class/$'
import { Functional, FunctionalEvents } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import {
  isConnected,
  SOCKET_SERVER_PEER_EMITTER,
} from '../../../../client/host/socket'
import { ST } from '../../../../interface/ST'
import { NOOP } from '../../../../NOOP'
import { Pod } from '../../../../pod'
import { evaluate } from '../../../../spec/evaluate'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'
import { Callback } from '../../../../types/Callback'
import { Unlisten } from '../../../../types/Unlisten'

export interface I<T> {
  id: string
  user: string
}

export interface O<T> {
  stream: ST
}

export type BroadcastReceiver_EE = { data: [any] }

export type BroadcastReceiverEvents = FunctionalEvents<BroadcastReceiver_EE> &
  BroadcastReceiver_EE

export default class BroadcastReceiver<T> extends Functional<
  I<T>,
  O<T>,
  BroadcastReceiverEvents
> {
  private _id: string | null = null
  private _transmitter_id: string | null = null

  private _peer: Peer | null = null
  private _peer_connected: boolean = false

  private _peer_unlisten: Unlisten | undefined = undefined
  private _socket_unlisten: Unlisten | undefined = undefined

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id', 'user'],
        o: ['stream'],
      },
      {
        input: {},
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      this._disconnect()
    })

    this.addListener('take_err', () => {
      if (!this._backwarding) {
        this._disconnect()
        this._backwarding = true
        this._input.id.pull()
        this._backwarding = false
      }
    })
  }

  private _peer_stream: MediaStream | null = null

  f({ id, user }: I<T>, done: Done<O<T>>) {
    this._connect(id, user)
  }

  d() {
    this._disconnect()
  }

  _connect(channel_id: string, user_id: string) {
    if (user_id !== undefined && channel_id !== undefined) {
      const transmitter_id = `${user_id}@${channel_id}`

      const socket_connected = isConnected()

      if (socket_connected) {
        if (this._peer) {
          this._disconnect()
        }

        this._transmitter_id = transmitter_id

        const id = newPeerReceiverId()

        this._id = id

        sendServerPeer('target', {
          id,
          transmitter_id,
        })

        const socket_server_peer_listener = async (_data) => {
          const { type: _type, data } = _data

          switch (_type) {
            case 'err':
              {
                const { message } = data
                this.err(message)
              }
              break
            case 'init':
              {
                const {
                  turn_key: { username, credential },
                } = data
                if (this._peer) {
                  return
                }
                console.log(
                  'Receiver',
                  'socket_server_peer_listener',
                  _type,
                  data
                )
                const config = buildIOTurnConfig(username, credential)
                const peer = new Peer(this.__system, this.__pod, false, config)
                this._peer_unlisten = this._setup_peer(id, transmitter_id, peer)
                this._peer = peer
              }
              break
            case 'offer':
              {
                const { signal } = data
                console.log('Receiver', 'socket_server_peer_listener', 'offer')
                await this._peer.acceptOffer(signal)

                const _signal = await this._peer.answer()

                sendServerPeer('answer', {
                  id,
                  transmitter_id,
                  signal: _signal,
                })
              }
              break
            case 'reset':
              {
                const { type: _type, id: _id } = data
                if (_type !== 'target' || _id !== transmitter_id) {
                  return
                }
                console.log(
                  'Receiver',
                  'socket_server_peer_listener',
                  _type,
                  data
                )
                this._disconnect()
                this._connect(channel_id, user_id)
              }
              break
          }
        }

        SOCKET_SERVER_PEER_EMITTER.addListener(
          this._id,
          socket_server_peer_listener
        )
        this._socket_unlisten = () => {
          SOCKET_SERVER_PEER_EMITTER.removeListener(
            this._id,
            socket_server_peer_listener
          )
        }
      } else {
        this.err('not logged in')
      }
    }
  }

  private _send_data = (data: any, callback: Callback) => {
    this._send({ type: 'data', data }, callback)
  }

  private _send = (data: any, callback: Callback): void => {
    if (this._peer_connected) {
      const message = stringify(data)
      this._peer.send(message)
      callback()
    } else {
      callback(undefined, 'peer not connected')
    }
  }

  private _setup_peer = (
    id: string,
    transmitter_id: string,
    peer: any
  ): Unlisten => {
    const signal_listener = (signal) => {
      console.log('Receiver', 'signal')
      sendServerPeer('answer', { id, transmitter_id, signal })
    }
    const connect_listener = () => {
      console.log('Receiver', 'Peer', 'connect')
      this._peer_connected = true
    }
    const error_listener = (err) => {
      console.log('Receiver', 'Peer', 'error', err)
      this.err(err.message)
    }
    const close_listener = () => {
      console.log('Receiver', 'Peer', 'close')
      this._disconnect()
    }
    const data_listener = (_message) => {
      const specs = { ...this.__system.specs, ...this.__pod.specs }
      const classes = this.__system.classes
      const message = _message.toString()
      const data = evaluate(message, specs, classes)
      console.log('Receiver', 'Peer', 'data', data)
      const { type: _type, data: _data } = data
      if (_type === 'data') {
        this.emit('data', _data)
      }
    }
    const start_listener = (stream) => {
      console.log('Receiver', 'Peer', 'stream', stream)
      const _stream = new (class Stream extends $ implements ST {
        __: string[] = ['ST']

        stream(callback: Callback<MediaStream>): Unlisten {
          callback(stream)
          return NOOP
        }
      })(this.__system, this.__pod)
      this._output.stream.push(_stream)
    }
    const stop_listener = () => {
      console.log('Receiver', 'Peer', 'stop')
      this._output.stream.pull()
    }

    peer.on('signal', signal_listener)
    peer.on('connect', connect_listener)
    peer.on('error', error_listener)
    peer.on('close', close_listener)
    peer.on('data', data_listener)
    peer.on('start', start_listener)
    peer.on('stop', stop_listener)

    return () => {
      peer.off('signal', signal_listener)
      peer.off('connect', connect_listener)
      peer.off('error', error_listener)
      peer.off('close', close_listener)
      peer.off('data', data_listener)
      peer.off('start', start_listener)
      peer.off('stop', stop_listener)
    }
  }

  private _disconnect = (): void => {
    const id = this._transmitter_id

    if (this._socket_unlisten) {
      this._socket_unlisten()
      this._socket_unlisten = undefined

      sendServerPeer('close', { type: 'target', id })
    }

    if (this._peer) {
      this._peer_unlisten()
      this._peer_unlisten = undefined
      this._peer.destroy()
      this._peer = null
      this._transmitter_id = null
      this._peer_connected = false
    }
  }
}
