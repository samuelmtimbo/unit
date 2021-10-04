import { $Graph } from '../../../async/$Graph'
import { $makeUnitRemoteRef } from '../../../client/makeUnitRemoteRef'
import { RemoteRef } from '../../../client/RemoteRef'
import { CONNECT, DISCONNECT, EXEC, TERMINATE } from '../../../constant/STRING'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../Unlisten'
import { uuidNotInLocalStorage } from './uuidNotInLocalStorage'

export const BROADCAST_SOURCE_LOCAL_STORAGE_PREFIX = '__BROADCAST__SOURCE__'
export const BROADCAST_TARGET_LOCAL_STORAGE_PREFIX = '__BROADCAST__TARGET__'

export type SystemBroadcast = {
  channel: BroadcastChannel
  id: string
}

export function localBroadcastSourceName(id: string): string {
  return `${BROADCAST_SOURCE_LOCAL_STORAGE_PREFIX}/${id}`
}

export function localBroadcastTargetName(id: string): string {
  return `${BROADCAST_TARGET_LOCAL_STORAGE_PREFIX}/${id}`
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
  return startBroadcast(BROADCAST_SOURCE_LOCAL_STORAGE_PREFIX)
}

export function startBroadcastTarget(): SystemBroadcast {
  return startBroadcast(BROADCAST_TARGET_LOCAL_STORAGE_PREFIX)
}

export function stopBroadcastSource(id: string): void {
  const _id = localBroadcastSourceName(id)
  localStorage.removeItem(_id)
}

export function stopBroadcastTarget(id: string): void {
  const _id = localBroadcastTargetName(id)
  localStorage.removeItem(_id)
}

export function shareLocalPod(graph: $Graph): {
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
          const ref = $makeUnitRemoteRef(graph, ['$U', '$C', '$G'], (data) => {
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
        throw new Error('Invalid Message Type')
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
