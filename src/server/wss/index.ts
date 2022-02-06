import * as http from 'http'
import * as WebSocket from 'ws'
import { parseCookies } from '../middleware/cookies'
import { verifyAuthToken } from '../middleware/verifyAuthToken'
import { EventEmitter } from '../../EventEmitter'
import { NOOP } from '../../NOOP'
import { Dict } from '../../types/Dict'
import { uuidNotIn } from '../../util/id'
import { Req } from '../req'
import { WSS_PING_T } from './constant'

const wss_user_session_socket: Dict<Dict<Dict<WebSocket>>> = {}
const wss_user_session_count: Dict<number> = {}
const wss_user_socket_count: Dict<number> = {}
const wss_user_session_socket_alive: Dict<Dict<Dict<boolean>>> = {}
const wss_user_session_socket_count: Dict<Dict<number>> = {}
let wss_socket_count: number = 0

export interface Peer {
  userId: string
  sessionId: string
  socketId: string
}

export function wsId(peer: Peer): string {
  const { userId, sessionId, socketId } = peer
  return `${userId}/${sessionId}/${socketId}`
}

export function getUserWSConnection(userId: string): Dict<Dict<WebSocket>> {
  return wss_user_session_socket[userId]
}

export function getWS(
  userId: string,
  sessionId: string,
  socketId: string
): WebSocket {
  return wss_user_session_socket[userId][sessionId][socketId]
}

export function send(ws: WebSocket, data: any): void {
  const message = JSON.stringify(data)
  ws.send(message)
}

export function userBroadcast(
  userId: string,
  sessionId: string,
  data: any
): void {
  const user_session_ws = wss_user_session_socket[userId] || {}
  for (const _sessionId in user_session_ws) {
    if (_sessionId !== sessionId) {
      const session_ws = user_session_ws[_sessionId]
      for (const _socketId in session_ws) {
        const ws = session_ws[_socketId]
        send(ws, data)
      }
    }
  }
}

function removeUserSessionSocket(
  userId: string,
  sessionId: string,
  socketId: string
): void {
  delete wss_user_session_socket[userId][sessionId][socketId]
  delete wss_user_session_socket_alive[userId][sessionId][socketId]
  wss_user_session_socket_count[userId][sessionId]--
  if (wss_user_session_socket_count[userId][sessionId] === 0) {
    delete wss_user_session_socket[userId][sessionId]
    delete wss_user_session_socket_count[userId][sessionId]
    delete wss_user_session_socket_alive[userId][sessionId]
    wss_user_session_count[userId]--
    if (wss_user_session_count[userId] === 0) {
      delete wss_user_session_count[userId]
    }
  }
  wss_user_socket_count[userId]--
  if (wss_user_socket_count[userId] === 0) {
    delete wss_user_socket_count[userId]
    delete wss_user_session_socket[userId]
    delete wss_user_session_socket_alive[userId]
  }
  wss_socket_count--
  console.log('wss_connection_count', wss_socket_count)
}

// export const EMITTER = {
//   server: new EventEmitter2(),
//   cloud: new EventEmitter2(),
//   user: new EventEmitter2(),
// }

export const emitter = new EventEmitter()

export * from './server'

export function start(server: http.Server) {
  server.on('upgrade', async function upgrade(req: Req, socket, head) {
    const { headers } = req
    const { cookie = '' } = headers
    const cookies = parseCookies(cookie)
    const { authToken, sessionId } = cookies

    function refuse() {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }

    if (!sessionId) {
      refuse()
      return
    }

    req.sessionId = sessionId

    try {
      // TODO deduplicate (authReq)
      const user = await verifyAuthToken(authToken)

      req.user = user

      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req, user)
      })
    } catch {
      refuse()
      return
    }
  })

  const wss = new WebSocket.Server({ noServer: true, path: '/' })

  wss.on('connection', function connection(ws, req: Req) {
    const { user, sessionId } = req

    const { userId: pbkey } = user

    const userId = pbkey

    wss_user_session_socket[userId] = wss_user_session_socket[userId] || {}
    wss_user_session_socket_alive[userId] =
      wss_user_session_socket_alive[userId] || {}

    if (wss_user_session_socket[userId][sessionId] === undefined) {
      wss_user_session_socket[userId][sessionId] =
        wss_user_session_socket[userId][sessionId] || {}
      wss_user_session_socket_alive[userId][sessionId] =
        wss_user_session_socket_alive[userId][sessionId] || {}
      wss_user_session_count[userId] = wss_user_session_count[userId] || 0
      wss_user_session_count[userId]++
      // console.log(
      //   'wss_user_session_socket[userId][sessionId]',
      //   wss_user_session_socket[userId][sessionId]
      // )
    }

    const socketId = uuidNotIn(wss_user_session_socket[userId][sessionId])

    wss_user_session_socket[userId][sessionId][socketId] = ws
    wss_user_session_socket_alive[userId][sessionId][socketId] = true

    wss_user_session_socket_count[userId] =
      wss_user_session_socket_count[userId] || {}

    wss_user_session_socket_count[userId][sessionId] =
      wss_user_session_socket_count[userId][sessionId] || 0
    wss_user_session_socket_count[userId][sessionId]++

    // console.log(
    //   'wss_user_session_socket_count[userId][sessionId]',
    //   wss_user_session_socket_count[userId][sessionId]
    // )

    wss_user_socket_count[userId] = wss_user_socket_count[userId] || 0
    wss_user_socket_count[userId]++

    // console.log('wss_user_socket_count[userId]', wss_user_socket_count[userId])

    wss_socket_count++

    // console.log('wss_socket_count', wss_socket_count)

    const peer: Peer = {
      userId,
      sessionId,
      socketId,
    }

    ws.on('message', function incoming(message) {
      const data_str = message.toString()
      try {
        const _data = JSON.parse(data_str)
        const { type, data } = _data
        emitter.emit(type, data, peer, ws)
      } catch (err) {
        console.log(err)
        console.error('wss', 'message', 'failed to parse JSON', data_str)
      }
    })

    ws.on('pong', () => {
      wss_user_session_socket_alive[userId][sessionId][socketId] = true
    })

    ws.on('close', () => {
      removeUserSessionSocket(userId, sessionId, socketId)
    })
  })

  const ping_interval = setInterval(function ping() {
    for (const userId in wss_user_session_socket_alive) {
      const session_socket = wss_user_session_socket[userId]
      const session_socket_alive = wss_user_session_socket_alive[userId]
      for (const sessionId in session_socket_alive) {
        const socket_alive = session_socket_alive[sessionId]
        const socket = session_socket[sessionId]
        for (const socketId in socket_alive) {
          const alive: boolean = socket_alive[socketId]
          const ws: WebSocket = socket[socketId]
          if (alive) {
            socket_alive[socketId] = false
            ws.ping(NOOP)
          } else {
            ws.terminate()
          }
        }
      }
    }
  }, WSS_PING_T)

  wss.on('close', function close() {
    console.log('wss', 'close')
    clearInterval(ping_interval)
  })
}
