import * as crypto from 'crypto'
import { emitter } from '..'
import { getWS, Peer, send, wsId } from '../..'
import { Dict } from '../../../../types/Dict'

const SECRET = 'wwa+aEIhIUYiSP0eCEswM9MUh0uHNFF14asEKn1d6Qw'

function generateTurnKey(): { username: string; credential: string } {
  // The username is a timestamp that represents the expiration date of this credential
  // In this case, it's valid for 12 hours (change the '12' to how many hours you want)
  const username = (Date.now() / 1000 + 12 * 3600).toString()

  // Now create the corresponding credential based on the secret
  const hmac = crypto.createHmac('sha1', SECRET)
  hmac.setEncoding('base64')
  hmac.write(username)
  hmac.end()
  const credential = hmac.read()

  return {
    username,
    credential,
  }
}

const _peer_source: Dict<string> = {}

const _peer_source_id: Dict<string> = {}

const _source_to_target: Dict<Set<string>> = {}

const _peer: { source: Dict<Set<string>>; target: Dict<Set<string>> } = {
  source: {},
  target: {},
}

export function send_server_peer(id: string, type: string, data: any): void {
  console.log('send_server_peer', id, type, data)
  const [userId, sessionId, socketId] = id.split('/')
  const t_ws = getWS(userId, sessionId, socketId)
  send(t_ws, {
    type: 'server',
    data: {
      type: 'peer',
      data: { type, data },
    },
  })
}

emitter.addListener('peer', (_data, peer: Peer, ws) => {
  const { type, data } = _data

  const { userId } = peer

  const ws_id = wsId(peer)

  switch (type) {
    case 'source':
      {
        const { id, _id } = data

        const transmitter_id = `${userId}@${id}`

        if (_peer_source[transmitter_id]) {
          send_server_peer(ws_id, _id, {
            type: 'source_err',
            data: {
              message: 'broadcast id taken',
            },
          })
          return
        }

        console.log('transmitter_id', transmitter_id)

        _peer_source[transmitter_id] = ws_id
        _peer_source_id[transmitter_id] = _id

        const target_set = _source_to_target[transmitter_id] || new Set()

        const ws_close_listener = () => {
          console.log('source', 'close')
          if (_peer_source[transmitter_id]) {
            delete _peer_source[transmitter_id]
            delete _peer_source_id[transmitter_id]
          }
          ws.removeListener('close', ws_close_listener)
        }
        ws.addListener('close', ws_close_listener)

        console.log('target_set', target_set)

        for (const receiver_id of target_set) {
          send_server_peer(ws_id, _id, {
            type: 'receiver',
            data: {
              receiver_id,
              turn_key: generateTurnKey(),
            },
          })
        }
      }
      break
    case 'target':
      {
        const { id, transmitter_id } = data

        const transmitter_id_regex = /^[a-z]+\@[a-z]+$/g
        const transmitter_id_regex_str = transmitter_id_regex.toString()
        if (!transmitter_id_regex.exec(transmitter_id)) {
          console.log(transmitter_id_regex_str.length)
          send_server_peer(ws_id, id, {
            type: 'err',
            data: {
              message: transmitter_id_regex_str,
            },
          })
          return
        }

        const receiver_id = `${ws_id}/${id}`

        console.log('receiver_id', receiver_id)

        _source_to_target[transmitter_id] =
          _source_to_target[transmitter_id] || new Set()

        _source_to_target[transmitter_id].add(receiver_id)

        const ws_close_listener = () => {
          console.log('target', 'close')
          if (_source_to_target[transmitter_id]) {
            _source_to_target[transmitter_id].delete(ws_id)
            if (_source_to_target[transmitter_id].size === 0) {
              delete _source_to_target[transmitter_id]
            }
          }
          ws.removeListener('close', ws_close_listener)
        }
        ws.addListener('close', ws_close_listener)

        send_server_peer(ws_id, id, {
          type: 'init',
          data: {
            turn_key: generateTurnKey(),
          },
        })

        const peer_source_ws_id = _peer_source[transmitter_id]
        const peer_source_id = _peer_source_id[transmitter_id]
        if (peer_source_ws_id && peer_source_id) {
          send_server_peer(peer_source_ws_id, peer_source_id, {
            type: 'receiver',
            data: {
              id,
              receiver_id,
              turn_key: generateTurnKey(),
            },
          })
        }
      }
      break
    case 'offer':
      {
        const { receiver_id, signal } = data
        // AD HOC
        const [_, __, ___, id] = receiver_id.split('/')
        // assuming receiver_id is the same as the ws_id
        send_server_peer(receiver_id, id, {
          type: 'offer',
          data: {
            receiver_id,
            signal,
          },
        })
      }
      break
    case 'answer':
      {
        const { id, transmitter_id, signal } = data
        const receiver_id = `${ws_id}/${id}`
        const transmitter_ws_id = _peer_source[transmitter_id]
        const _transmiter_id = _peer_source_id[transmitter_id]
        send_server_peer(transmitter_ws_id, _transmiter_id, {
          type: 'answer',
          data: {
            id: transmitter_id,
            receiver_id,
            signal,
          },
        })
      }
      break
    case 'close':
      {
        const { type, id } = data as { type: 'source' | 'target'; id: string }
        const peer_type = type === 'source' ? 'target' : 'source'
        const set = _peer[type][id]
        if (set) {
          set.delete(ws_id)
          if (set.size === 0) {
            delete _peer[type][id]
          }
        }
        const peer_set = _peer[peer_type][id]
        if (peer_set) {
          for (const peer_ws_id of peer_set) {
            send_server_peer(peer_ws_id, 'reset', {
              type: 'reset',
              data: {
                id,
                type: peer_type,
              },
            })
          }
        }
      }
      break
  }
})
