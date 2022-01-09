import { Peer } from '../../../../../api/peer/Peer'
import { sendServerPeer } from '../../../../../api/server/peer'
import { buildIOTurnConfig } from '../../../../../api/server/peer/config'
import {
  newPeerTransmitterId,
  removePeerTransmitterId,
} from '../../../../../api/server/peer/id'
import { Functional } from '../../../../../Class/Functional'
import {
  isConnected,
  SOCKET_SERVER_PEER_EMITTER,
} from '../../../../../client/host/socket'
import { ST } from '../../../../../interface/ST'
import { Pod } from '../../../../../pod'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'

export interface I {
  id: string
  graph: ST
}

export interface O {}

export default class BroadcastShareGraph extends Functional<I, O> {
  private _id: string | null = null

  private _peer: Dict<Peer> = {}
  private _peer_connected: Dict<boolean> = {}
  private _peer_unlisten: Dict<Unlisten> = {}

  private _flag_err_source_err: boolean = false

  private _pod: MediaStream | null = null

  private _socket_unlisten: Unlisten | undefined = undefined

  private _pod_unlisten: Unlisten

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id', 'graph'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      this._disconnect()

      removePeerTransmitterId(this._id)
    })

    this.addListener('take_err', () => {
      if (this._flag_err_source_err) {
        this._flag_err_source_err = false
        this._backward('id')
      } else {
        // TODO
        if (!this._backwarding) {
          this._disconnect()
          this._backward('id')
        }
      }
    })

    this._id = newPeerTransmitterId()
  }

  f({ graph, id }: I) {
    this._connect(id)
  }

  d() {
    this._disconnect()
  }

  private _connect(id: string) {
    const socket_connected = isConnected()
    if (socket_connected) {
      this._disconnect_all_peer()

      this._connect_peer(id)
    } else {
      this.err('not logged in')
    }
  }

  private async _send_data(data: any) {
    return this._send({ type: 'data', data })
  }

  private async _send(data: any): Promise<void> {
    const message = stringify(data)
    for (const id in this._peer) {
      const peer = this._peer[id]
      peer.send(message)
    }
    return
  }

  private _setup_socket = (id: string): void => {
    console.log('BroadcastTransmitter', '_setup_socket')
    const socket_server_peer_listener = async (_data) => {
      console.log('BroadcastTransmitter', 'socket_server_peer_listener', _data)
      const { type: _type, data } = _data

      switch (_type) {
        case 'source_err':
          {
            this._flag_err_source_err = true

            const { message } = data

            this.err(message)
          }
          break
        case 'receiver':
          {
            const {
              receiver_id,
              turn_key: { username, credential },
            } = data
            console.log(
              'Transmitter',
              'socket_server_peer_listener',
              _type,
              data
            )
            const config = buildIOTurnConfig(username, credential)
            const peer = new Peer(this.__system, this.__pod, true, config)
            this._peer_unlisten[receiver_id] = this._setup_peer(
              receiver_id,
              peer
            )
            this._peer[receiver_id] = peer

            const signal = await peer.offer()

            sendServerPeer('offer', { type: 'source', id, receiver_id, signal })
          }
          break
        case 'answer':
          {
            const { id: _id, receiver_id, signal } = data
            console.log(
              'Transmitter',
              'socket_server_peer_listener',
              'answer',
              data
            )
            const peer = this._peer[receiver_id]

            await peer.acceptAnswer(signal)
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
  }

  private _connect_peer = (id: string) => {
    sendServerPeer('source', {
      id,
      _id: this._id,
    })

    this._setup_socket(id)
  }

  private _setup_peer = (receiver_id: string, peer: any): Unlisten => {
    const signal_listener = (signal) => {
      console.log('Transmitter', 'signal')
      sendServerPeer('offer', { receiver_id, signal })
    }
    const connect_listener = () => {
      console.log('Transmitter', 'connect')
      this._peer_connected[receiver_id] = true

      if (this._pod) {
        // TODO
      }
    }
    const error_listener = (err) => {
      console.log('Transmitter', 'error', err)
      this.err(err.message)
    }
    const close_listener = () => {
      console.log('Transmitter', 'close')
      this._disconnect_peer(receiver_id)
    }

    peer.on('signal', signal_listener)
    peer.on('connect', connect_listener)
    peer.on('error', error_listener)
    peer.on('close', close_listener)

    return () => {
      peer.off('signal', signal_listener)
      peer.off('connect', connect_listener)
      peer.off('error', error_listener)
      peer.off('close', close_listener)
    }
  }

  private _disconnect = (): void => {
    sendServerPeer('close', { type: 'source', id: this._input.id.peak() })

    if (this._socket_unlisten) {
      this._socket_unlisten()
      this._socket_unlisten = undefined
    }

    this._disconnect_all_peer()

    if (this._pod_unlisten) {
      this._pod_unlisten()
      this._pod_unlisten = undefined
    }

    if (this._pod) {
      this._pod = null
    }
  }

  private _disconnect_all_peer = (): void => {
    const peer_ids = Object.keys(this._peer)
    for (const peer_id of peer_ids) {
      this._disconnect_peer(peer_id)
    }
  }

  private _disconnect_peer = (id: string): void => {
    const unlisten = this._peer_unlisten[id]
    unlisten()
    this._peer_unlisten = undefined

    const peer = this._peer[id]
    // peer.destroy()
    delete this._peer[id]

    delete this._peer_connected[id]
  }

  async send(data: any): Promise<void> {
    return this._send_data(data)
  }
}
