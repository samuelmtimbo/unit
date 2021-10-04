import { Callback } from '../../Callback'
import { Dict } from '../../types/Dict'
import { uuid } from '../../util/id'

const isInstalled = (): boolean => {
  const __EXTENSION_INSTALLED = !!document.getElementById(
    '__EXTENSION_INSTALLED'
  )
  return __EXTENSION_INSTALLED
}

const _callback: Dict<Callback> = {}

export function postMessage(data: any, callback: Callback): void {
  setup()

  const installed = isInstalled()
  if (installed) {
    const id = uuid()
    _callback[id] = callback
    window.postMessage({ type: 'EXTENSION_IN', id, data }, location.origin)
  } else {
    callback(undefined, 'extension not installed')
  }
}

export function postCallMessage(data: any, callback: Callback<any>): void {
  postMessage(
    {
      type: 'CALL',
      data,
    },
    callback
  )
}

export function callMethod(
  type: string,
  method: string,
  data: any,
  callback: Callback<any>
): void {
  postCallMessage(
    {
      type,
      method,
      data,
    },
    callback
  )
}

let _init = false

export function setup(): void {
  if (_init) {
    return
  }

  window.addEventListener('message', (event: MessageEvent) => {
    // only accept messages from this window
    if (event.source !== window) {
      return
    }

    const { data } = event

    const { type, id, data: _data } = data

    if (type && type === 'EXTENSION_OUT' && id) {
      const callback = _callback[id]
      if (callback) {
        delete _callback[id]
        callback(_data)
      }
    }
  })

  _init = true
}
