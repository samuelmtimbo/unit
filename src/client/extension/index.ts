import { CALL, CALLBACK } from '../../constant/STRING'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { uuid } from '../../util/id'

const _callback: Dict<Callback> = {}

export const SYSTEM_EXTENSION_ID = '___SYSTEM__EXTENSION___'

export function getExtensionElement(): HTMLElement {
  return document.getElementById(SYSTEM_EXTENSION_ID) as HTMLElement
}

export function isExtensionInstalled(): boolean {
  const installed = !!getExtensionElement()

  return installed
}

export function dispatchExtensionEvent(
  type: 'send' | 'callback',
  id: string,
  data: any
) {
  const element = getExtensionElement()

  element.dispatchEvent(
    new CustomEvent('message', {
      detail: { type, id, data },
    })
  )
}

export function postMessage(data: any, callback: Callback): void {
  setup()

  const installed = isExtensionInstalled()

  if (installed) {
    const id = uuid()

    _callback[id] = callback

    dispatchExtensionEvent('send', id, data)
  } else {
    callback(undefined, 'extension not installed')
  }
}

export function postCallMessage(data: any, callback: Callback<any>): void {
  postMessage(
    {
      type: CALL,
      data,
    },
    callback
  )
}

export function callExtensionMethod(
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

  const element = getExtensionElement()

  element.addEventListener('message', (event: CustomEvent<any>) => {
    const { detail } = event

    const { type, id, data } = detail

    if (type === CALLBACK) {
      const callback = _callback[id]

      if (callback) {
        delete _callback[id]

        callback(data)
      }
    }
  })

  _init = true
}
