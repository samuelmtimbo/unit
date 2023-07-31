import { Graph } from '../../../Class/Graph'
import { makeUnitRemoteRef } from '../../../client/makeUnitRemoteRef'
import { RemoteRef } from '../../../client/RemoteRef'
import { CONNECT, DISCONNECT, EXEC, TERMINATE } from '../../../constant/STRING'
import { Dict } from '../../../types/Dict'
import { $Graph } from '../../../types/interface/async/$Graph'
import { Unlisten } from '../../../types/Unlisten'
import { uuidNotInLocalStorage } from './uuidNotInLocalStorage'

export const LOCAL_STORAGE_PREFIX_BROADCAST_SOURCE = '__BROADCAST__SOURCE__'
export const LOCAL_STORAGE_PREFIX_BROADCAST_TARGET = '__BROADCAST__TARGET__'

export type SystemBroadcast = {
  channel: BroadcastChannel
  id: string
}

export function localBroadcastSourceName(id: string): string {
  return `${LOCAL_STORAGE_PREFIX_BROADCAST_SOURCE}/${id}`
}

export function localBroadcastTargetName(id: string): string {
  return `${LOCAL_STORAGE_PREFIX_BROADCAST_TARGET}/${id}`
}

export function hasLocalBroadcastSource(id: string): boolean {
  const _id = localBroadcastSourceName(id)
  const has = localStorage.getItem(_id) !== null
  return has
}

export function hasLocalBroadcastTarget(id: string): boolean {
  const _id = localBroadcastTargetName(id)
  const has = localStorage.getItem(_id) !== null
  return has
}

export function startBroadcast(prefix: string): SystemBroadcast {
  const [id, _id] = uuidNotInLocalStorage(prefix)
  localStorage.setItem(_id, '')
  const channel = new BroadcastChannel(_id)
  return { channel, id }
}

export function startBroadcastSource(): SystemBroadcast {
  return startBroadcast(LOCAL_STORAGE_PREFIX_BROADCAST_SOURCE)
}

export function startBroadcastTarget(): SystemBroadcast {
  return startBroadcast(LOCAL_STORAGE_PREFIX_BROADCAST_TARGET)
}

export function stopBroadcastSource(id: string): void {
  const _id = localBroadcastSourceName(id)
  localStorage.removeItem(_id)
}

export function stopBroadcastTarget(id: string): void {
  const _id = localBroadcastTargetName(id)
  localStorage.removeItem(_id)
}

export function shareLocalGraph(graph: Graph): {
  id: string
  terminate: Unlisten
} {
  const { channel: broadcastChannel, id } = startBroadcastSource()

  const _target: Dict<{ bc: BroadcastChannel; ref: RemoteRef }> = {}

  broadcastChannel.addEventListener('message', (event: MessageEvent) => {
    const { data } = event

    const { type, data: _data } = data

    switch (type) {
      case CONNECT:
        {
          const name = _data
          const bc = new BroadcastChannel(name)
          const ref = makeUnitRemoteRef(graph, ['U', 'C', 'G'], (data) => {
            bc.postMessage({ type: EXEC, data })
          })
          bc.addEventListener('message', (event: MessageEvent): void => {
            const { data } = event
            ref.exec(data)
          })
          _target[id] = { bc, ref }
        }
        break
      case DISCONNECT:
        {
          const id = _data
          delete _target[id]
        }
        break
      default:
        throw new Error('invalid message type')
    }
  })

  const terminate = () => {
    for (const id in _target) {
      const target = _target[id]
      const { bc } = target
      bc.postMessage({ type: TERMINATE, data: {} })
      bc.close()
    }
    broadcastChannel.close()
  }

  return { id, terminate }
}
